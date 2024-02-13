import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import Input from "../Input/index";
import { database } from "../firebase";
import { ref, remove, update } from "firebase/database";
import { useRouter } from "next/navigation";

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  onDelete: (id: UniqueIdentifier) => void;
  currentContainerId: UniqueIdentifier;
  itemId: UniqueIdentifier | null;
};

const Items = ({
  id,
  title,
  onDelete,
  currentContainerId,
  itemId,
}: ItemsType) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditing, setEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });

  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user as string);

    if (userData) {
      setUserEmail(userData.uid);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleDelete = () => {
    onDelete(id);
  };
  const handleEdit = () => {
    setEditing(true);
  };

  const handleSaveEdit = () => {
    setEditing(false);
    const itemRef = ref(
      database,
      `users/${userEmail}/columns/${currentContainerId}/items/${itemId}`
    );
    update(itemRef, { title: editedTitle });
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditedTitle(title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "px-2 py-2 mx-2 bg-gray-50 shadow-md rounded-xl w-[19rem] border border-transparent hover:border-gray-200 cursor-pointer",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        {isEditing ? (
          <Input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            name="itemname"
          />
        ) : (
          <p className="pl-l">{title}</p>
        )}
        <div className="flex justify-center items-center gap-2">
          {isEditing ? (
            <>
              <button
                title="Save Edit"
                onClick={handleSaveEdit}
                className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-green-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
              <button
                title="Cancel Edit"
                onClick={handleCancelEdit}
                className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-rose-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                title="Edit Icon"
                onClick={handleEdit}
                className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              <button
                title="Delete Icon"
                onClick={handleDelete}
                className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-rose-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </>
          )}
          <button
            className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
            {...listeners}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-gray-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Items;
