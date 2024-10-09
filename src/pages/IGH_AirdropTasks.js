import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
`;

const Thead = styled.thead`
  background-color: #2c3e50;
  color: white;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: bold;
`;

const Tbody = styled.tbody`
  & > tr:nth-child(even) {
    background-color: #f4f4f4;
  }
`;

const Td = styled.td`
  padding: 15px;
  vertical-align: middle;
  word-break: break-word;
`;

const Button = styled.button`
  padding: 8px 12px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3498db;
  }
`;

const CreateTaskButton = styled(Button)`
  padding: 10px 20px;
  margin-bottom: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #2980b9;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #2980b9;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #2980b9;
  }
`;

const ActionButton = styled(Button)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
  }
`;

const LinkPreview = styled.a`
  color: #2980b9;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const truncateLink = (link) => {
  if (!link) return "";
  return link.length > 30 ? `${link.substring(0, 27)}...` : link;
};

function IGHAirdropTasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    link: "",
    points: "",
    proofPlaceholder: "Provide proof here",
    category: "Special",
    taskType: "telegram",
    telegramAction: "join",
    chatId: "",
    logo: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching IGH tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleCreateTask = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setNewTask({
      name: "",
      description: "",
      link: "",
      points: "",
      proofPlaceholder: "Provide proof here",
      category: "Special",
      taskType: "telegram",
      telegramAction: "join",
      chatId: "",
      logo: "",
    });
  };

  const handleEditTask = (task) => {
    setIsEditMode(true);
    setCurrentTaskId(task._id);
    setNewTask({
      name: task.name,
      description: task.description,
      link: task.link,
      points: task.points,
      proofPlaceholder: task.proofPlaceholder || "Provide proof here",
      category: task.category,
      taskType: task.taskType,
      telegramAction: task.telegramAction || "join",
      chatId: task.chatId || "",
      logo: task.logo || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    const formattedTask = {
      ...newTask,
      points: Number(newTask.points),
    };

    try {
      if (isEditMode) {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/igh-airdrop-tasks/${currentTaskId}`,
          formattedTask
        );
        setTasks(
          tasks.map((task) => (task._id === currentTaskId ? response.data : task))
        );
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`,
          formattedTask
        );
        setTasks([...tasks, response.data]);
      }

      setIsModalOpen(false);
      setNewTask({
        name: "",
        description: "",
        link: "",
        points: "",
        proofPlaceholder: "Provide proof here",
        category: "Special",
        taskType: "telegram",
        telegramAction: "",
        chatId: "",
        logo: "",
      });
    } catch (error) {
      console.error("Error creating/updating task:", error);
      if (error.response && error.response.data) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/igh-airdrop-tasks/${taskId}`
        );
        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <Container>
      <Title>IGH Airdrop Tasks</Title>
      <CreateTaskButton onClick={handleCreateTask}>
        Create New Task
      </CreateTaskButton>
      <TaskTable>
        <Thead>
          <tr>
            <Th>Task Name</Th>
            <Th>Description</Th>
            <Th>Link</Th>
            <Th>Points</Th>
            <Th>Category</Th>
            <Th>Task Type</Th>
            <Th>Telegram Action</Th>
            <Th>Telegram Chat ID</Th>
            <Th>Logo</Th>
            <Th>Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <Td>{task.name}</Td>
              <Td>{task.description}</Td>
              <Td>
                <LinkPreview
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateLink(task.link)}
                </LinkPreview>
              </Td>
              <Td>{task.points}</Td>
              <Td>{task.category}</Td>
              <Td>{task.taskType}</Td>
              <Td>{task.telegramAction || "N/A"}</Td>
              <Td>{task.chatId || "N/A"}</Td>
              <Td>
                {task.logo ? (
                  <img
                    src={task.logo}
                    alt="Logo"
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  "No logo"
                )}
              </Td>
              <Td>
                <Button onClick={() => handleEditTask(task)}>Edit</Button>
                <ActionButton onClick={() => handleDeleteTask(task._id)}>
                  Delete
                </ActionButton>
              </Td>
            </tr>
          ))}
        </Tbody>
      </TaskTable>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>{isEditMode ? "Edit Task" : "Create New Task"}</h2>
              <Button onClick={handleCloseModal}>Close</Button>
            </ModalHeader>
            <form onSubmit={handleSubmitTask}>
              <Label>Task Name</Label>
              <Input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleInputChange}
                required
              />
              <Label>Description</Label>
              <TextArea
                name="description"
                rows="3"
                value={newTask.description}
                onChange={handleInputChange}
                required
              />
              <Label>Link</Label>
              <Input
                type="url"
                name="link"
                value={newTask.link}
                onChange={handleInputChange}
                required
              />
              <Label>Points</Label>
              <Input
                type="number"
                name="points"
                value={newTask.points}
                onChange={handleInputChange}
                required
              />
              <Label>Proof Placeholder</Label>
              <Input
                type="text"
                name="proofPlaceholder"
                value={newTask.proofPlaceholder}
                onChange={handleInputChange}
                required
              />
              <Label>Category</Label>
              <Select
                name="category"
                value={newTask.category}
                onChange={handleInputChange}
                required
              >
                <option value="Special">Special</option>
                <option value="Daily">Daily</option>
                <option value="Lists">Lists</option>
                <option value="Extra">Extra</option>
              </Select>

              <Label>Task Type</Label>
              <Select
                name="taskType"
                value={newTask.taskType}
                onChange={handleInputChange}
                required
              >
                <option value="telegram">Telegram</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="others">Others</option>
              </Select>

              {newTask.taskType === "telegram" && (
                <>
                  <Label>Telegram Action</Label>
                  <Select
                    name="telegramAction"
                    value={newTask.telegramAction}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="join">Join Group/Channel</option>
                    <option value="subscribe">Subscribe to Channel</option>
                    <option value="send_message">Send Message to Group/Channel</option>
                  </Select>

                  <Label>Telegram Chat ID</Label>
                  <Input
                    type="text"
                    name="chatId"
                    value={newTask.chatId}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}

              <Label>Logo URL</Label>
              <Input
                type="url"
                name="logo"
                value={newTask.logo}
                onChange={handleInputChange}
              />

              <Button type="submit">
                {isEditMode ? "Update Task" : "Create Task"}
              </Button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default IGHAirdropTasks;