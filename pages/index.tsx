"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Navbar from "../components/Navbar";
// DnD
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { Inter } from "next/font/google";

// Components
import Container from "@/components/Container";
import Items from "@/components/Item";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { child, get, onValue, push, ref, remove, set } from "firebase/database";
import { database } from "@/components/firebase";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
    itemId: UniqueIdentifier | null;
  }[];
};

export default function Home() {
  const [containers, setContainers] = useState<DNDType[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  const [containerName, setContainerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const onAddContainer = () => {
    if (!containerName) return;
    const id = `container-${uuidv4()}`;
    const columnsRef = ref(database, `users/${userEmail}/columns`);
    const newColumnRef = push(columnsRef);
    set(newColumnRef, {
      title: containerName,
      items: [],
    });
    // Update local state
    setContainers([
      ...containers,
      {
        id: newColumnRef.key as UniqueIdentifier,
        title: containerName,
        items: [],
      },
    ]);

    setContainerName("");
    setShowAddContainerModal(false);
  };

  const onAddItem = () => {
    if (!itemName) return;
    const id = `item-${uuidv4()}`;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    const itemsRef = ref(
      database,
      `users/${userEmail}/columns/${currentContainerId}/items`
    );
    const newItemRef = push(itemsRef);
    const newItemId = newItemRef.key;

    if (newItemId) {
      set(newItemRef, {
        id: id,
        title: itemName,
        itemId: newItemId,
      });
      container.items.push({
        id: id,
        title: itemName,
        itemId: newItemId,
      });
      setContainers([...containers]);
      console.log([...containers]);
    } else {
      console.error("Failed to get newItemId");
    }

    setItemName("");
    setShowAddItemModal(false);
  };

  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }
    if (type === "item") {
      return containers.find((container) =>
        container.items.find((item) => item.id === id)
      );
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.id === id);
    if (!item) return "";
    return item.title;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return [];
    return container.items;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id.toString()
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id.toString()
      );

      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );

      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );
      } else {
        // different container
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }

    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id
      );
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );

      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );
        setContainers(newItems);
      } else {
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }

    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
    setActiveId(null);
  }

  const handleDeleteItem = (itemId: UniqueIdentifier) => {
    let currentContainerId: UniqueIdentifier | undefined;
    let currentItemId: UniqueIdentifier | null = null;

    const updatedContainers = containers.map((container) => {
      const updatedItems = container.items.filter((item) => {
        if (item.id === itemId) {
          currentContainerId = container.id;
          currentItemId = item.itemId;
          return false;
        }
        return true;
      });
      return {
        ...container,
        items: updatedItems,
      };
    });
    const containerRef = ref(
      database,
      `users/${userEmail}/columns/${currentContainerId}/items/${currentItemId}`
    );
    remove(containerRef);
    setContainers(updatedContainers);
  };

  const onDeleteContainer = (containerId: UniqueIdentifier) => {
    const updatedContainers = containers.filter(
      (container) => container.id !== containerId
    );
    setContainers(updatedContainers);
    const containerRef = ref(
      database,
      `users/${userEmail}/columns/${containerId}`
    );
    remove(containerRef);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user as string);

    if (userData) {
      setUserEmail(userData.uid);

      const columnsRef = ref(database, `users/${userData.uid}/columns`);

      onValue(columnsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const containersData = Object.keys(data).map((containerId) => {
            const container = data[containerId];
            const itemsData = container.items
              ? Object.keys(container.items).map((itemId) => ({
                  id: container.items[itemId].id,
                  title: container.items[itemId].title,
                  itemId: container.items[itemId].itemId,
                }))
              : [];

            return {
              id: containerId,
              title: container.title,
              items: itemsData,
            };
          });

          setContainers(containersData);
        }
      });
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      {userEmail ? (
        <>
          <div className="relative h-full rounded-2xl m-10 glass-effect p-2">
            {/* add column modal */}
            <Modal
              showModal={showAddContainerModal}
              setShowModal={setShowAddContainerModal}
            >
              <div className="flex flex-col w-full items-start gap-y-4">
                <h1 className="text-gray-800 text-3xl font-bold">Add Column</h1>
                <Input
                  type="text"
                  placeholder="Container Title"
                  name="containername"
                  value={containerName}
                  onChange={(e) => setContainerName(e.target.value)}
                />
                <Button onClick={onAddContainer}>Add Column</Button>
              </div>
            </Modal>

            {/* add item modal */}
            <Modal
              showModal={showAddItemModal}
              setShowModal={setShowAddItemModal}
            >
              <div className="flex flex-col w-full items-start gap-y-4">
                <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
                <Input
                  type="text"
                  placeholder="Item Title"
                  name="itemname"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button onClick={onAddItem}>Add Item</Button>
              </div>
            </Modal>

            {/* top navbar */}
            <Navbar />

            <Button
              className="my-2 glass-effect"
              onClick={() => setShowAddContainerModal(true)}
            >
              Add Column
            </Button>

            <div className="flex flex-wrap justify-center lg:justify-start md:justify-center gap-6 px-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={containers.map((i) => i.id)}>
                  {containers.map((container) => (
                    <Container
                      id={container.id}
                      title={container.title}
                      key={container.id}
                      onDeleteContainer={onDeleteContainer}
                      onAddItem={() => {
                        setShowAddItemModal(true);
                        setCurrentContainerId(container.id);
                      }}
                    >
                      <SortableContext items={container.items.map((i) => i.id)}>
                        <div className="flex items-start flex-col gap-y-4">
                          {container.items.map((i) => (
                            <Items
                              title={i.title}
                              id={i.id}
                              key={i.id}
                              itemId={i.itemId}
                              onDelete={() => handleDeleteItem(i.id)}
                              currentContainerId={container.id}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </Container>
                  ))}
                </SortableContext>
                <DragOverlay adjustScale={false}>
                  {activeId && activeId.toString().includes("item") && (
                    <Items
                      id={activeId}
                      title={findItemTitle(activeId)}
                      onDelete={() => handleDeleteItem(activeId)}
                      currentContainerId={activeId}
                      itemId={activeId}
                    />
                  )}
                  {activeId && activeId.toString().includes("container") && (
                    <Container
                      id={activeId}
                      title={findContainerTitle(activeId)}
                      onDeleteContainer={onDeleteContainer}
                    >
                      {findContainerItems(activeId).map((i) => (
                        <Items
                          key={i.id}
                          title={i.title}
                          id={i.id}
                          itemId={activeId}
                          onDelete={() => handleDeleteItem(i.id)}
                          currentContainerId={activeId}
                        />
                      ))}
                    </Container>
                  )}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
          <Toaster />
        </>
      ) : null}
    </>
  );
}
