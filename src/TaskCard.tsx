import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { IoMdCheckboxOutline } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { myFormSchema } from "./myFormSchema";

type FormData = {
  taskTitle: string;
};

type Task = {
  id: number;
  name: string;
  completed: boolean;
};

type TaskCardProps = {
  item: Task;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const TaskCard: React.FC<TaskCardProps> = ({ item, tasks, setTasks }) => {
  const [edit, setEdit] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(myFormSchema),
  });

  const notify = (state: "error" | "success", msg: string): React.ReactNode => {
    if (state === "error") {
      toast.error(msg, { position: "bottom-center" });
    } else {
      toast.success(msg, { position: "bottom-center" });
    }
    return <p>{msg}</p>;
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const newArray = tasks.map((i: Task) =>
      i.id === item.id ? { ...i, name: data.taskTitle } : i
    );

    setEdit(false);
    setTasks(newArray);
    notify("success", "Todo updated successfully!");
  };

  const updateTasksState = (itemId: number, newValue: boolean) => {
    const newArray = tasks.map((item) =>
      item.id === itemId ? { ...item, completed: !newValue } : item
    );
    notify("success", "Todo status updated successfully!");
    setTasks(newArray);
  };

  const deleteTask = (itemId: number) => {
    const newArray = tasks.filter((item) => item.id !== itemId);

    setTasks(newArray);
  };

  useEffect(() => {
    if (
      errors &&
      errors.taskTitle?.message ===
        "Task title is required and should not be empty"
    ) {
      notify("error", "Todo field cannot be empty!");
    }
  }, [errors]);

  return (
    <Card className="p-0">
      <Card.Body>
        {!edit ? (
          <>
            <p
              style={{
                textDecoration: item.completed ? "line-through" : "",
                textAlign: "start",
              }}
            >
              {item.name}
            </p>
            <Row>
              <Col sm="6" style={{ textAlign: "start" }}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => updateTasksState(item.id, item.completed)}
                >
                  {item.completed ? (
                    <>
                      <LuRefreshCcw /> Mark Undone
                    </>
                  ) : (
                    <>
                      <IoMdCheckboxOutline /> Mark Completed
                    </>
                  )}
                </span>
              </Col>
              <Col sm="6">
                <Row className="justify-content-end">
                  <Col sm="auto">
                    <span className="" onClick={() => setEdit(true)}>
                      <FaRegEdit />
                      edit
                    </span>
                  </Col>
                  <Col sm="auto">
                    <span
                      style={{ color: "red" }}
                      onClick={() => deleteTask(item.id)}
                    >
                      <FaRegTrashAlt color="red" />
                      delete
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className=" mb-3">
              <Col sm="10">
                <Form.Control
                  {...register("taskTitle")}
                  className="input"
                  type="text"
                  placeholder="start typing..."
                  defaultValue={item.name}
                />
                {errors?.taskTitle?.message ===
                  "Task title should contain at least 3 characters" && (
                  <p className="text-danger">{errors.taskTitle.message}</p>
                )}
              </Col>
              <Col sm="1">
                <Button type="submit" className="btn px-3" variant="danger">
                  Edit
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card.Body>
      <Toaster />
    </Card>
  );
};

export default TaskCard;
