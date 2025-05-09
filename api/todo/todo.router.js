
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-17
 * @Last Modified by: 
 * @Last Modified time: 2023-12-19 14:15:25
 * @Description: All the routes available for the API todo
 */

const router = require("express").Router();
const {
  createTodo,
  updateTodo,
  updateTodoPosition,
  deleteTodo,
  copyTodo,
  getTodos,
  getTodoById,  
  reorderTodo,
} = require("./todo.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.post("/create", createTodo); 
router.post("/update", updateTodo); 
router.post("/position", updateTodoPosition); 
router.get("/", getTodos); 
router.get("/reorder", reorderTodo); 
router.get("/delete/:id", deleteTodo);
router.post("/copy", copyTodo);
router.get("/:id", getTodoById); 



module.exports = router;
