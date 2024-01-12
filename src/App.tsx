import React, { useEffect, useState } from "react";

import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { IoRocketSharp } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "./zustand/store";

import { myFormSchema } from "./myFormSchema";
import "./App.css";
import TaskCard from "./TaskCard";

type FormData = {
  taskTitle: string;
};

type Task = {
  id: number;
  name: string;
  completed: boolean;
};

function App() {
  //zustand
  const addTodo = useStore((state) => state.addTodo);

  //state
  const [tasks, setTasks] = useState<Task[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(myFormSchema),
  });

  const notify = (state: "error" | "success", msg: any): React.ReactNode => {
    if (state === "error") {
      toast.error(msg, { position: "bottom-center" });
    } else {
      toast.success(msg, { position: "bottom-center" });
    }
    return <p>{msg}</p>;
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const newTask: Task = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      name: data.taskTitle,
      completed: false,
    };

    // Use setTasks to update the state
    setTasks([...tasks, newTask]);
    addTodo(newTask);
    reset();
    notify("success", "Todo added successfully!");
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
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("myTasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    const storedData = localStorage.getItem("myTasks");
    if (storedData) {
      setTasks(JSON.parse(storedData));
      // addTodo(JSON.parse(storedData));
    }
  }, []);
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="justify-content-center mb-3">
          <Col sm="4">
            <Form.Control
              {...register("taskTitle")}
              className="input"
              type="text"
              placeholder="start typing..."
            />
            {errors?.taskTitle?.message ===
              "Task title should contain at least 3 characters" && (
              <p className="text-danger">{errors.taskTitle.message}</p>
            )}
          </Col>
          <Col sm="1">
            <Button type="submit" className="btn px-3" variant="primary">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
      <Row className="justify-content-center">
        <Col sm="5">
          {tasks && tasks.length > 0 ? (
            tasks.map((item, index) => {
              return (
                <div key={index} className="my-1">
                  <TaskCard item={item} tasks={tasks} setTasks={setTasks} />
                </div>
              );
            })
          ) : (
            <Card style={{ width: "100%" }}>
              <Card.Body>
                <IoRocketSharp size={35} className="mb-3" />
                <p>You have nothing to do!</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Toaster />
    </>
  );
}

export default App;
