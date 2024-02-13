import React from "react";
import ContainerProps from "./container.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "../Button";

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
  onDeleteContainer,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "min-w-[17rem] h-96 bg-gray-200  rounded-xl flex flex-col items-center gap-y-4",
        isDragging && "opacity-50"
      )}
    >
      <div className="w-full flex items-center justify-between bg-gray-300 rounded-t-xl px-2 py-3">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-700 text-xl font-medium">{title}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
            onClick={() => onDeleteContainer(id)}
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
        </div>
      </div>

      {children}
      <button className="m-2 text-gray-800 w-10 h-10 flex rounded-full border-2 border-gray-800 justify-center items-center" onClick={onAddItem}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
};

export default Container;
