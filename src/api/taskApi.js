import axiosInstance from "./axiosInstance";

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await axiosInstance.get("/tasks/");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Update a task (PATCH)
export const updateTask = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/tasks/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

// Create a new task
export const createTask = async (data) => {
  try {
    
    const payload = {
      title: data.title,
      description: data.description,
      assigned_to: parseInt(data.assigned_to), 
      deadline: data.deadline || null, 
    };

    const response = await axiosInstance.post("/tasks/", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};
