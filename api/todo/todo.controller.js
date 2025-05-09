
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-17
 * @Last Modified by: 
 * @Last Modified time: 2023-12-21 15:01:11
 * @Description: All the controllers (call operations) for the API todo
 */


const {
  createTodo,
  updateTodo,
  updateTodoPosition,
  deleteTodo,
  copyTodo,
  getTodos,
  getTodoById,
  reorderTodo
} = require("./todo.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Todo 
  // -----------------------------------------------------------
  createTodo: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a todo
    const result = await createTodo(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.todoId,
      message: "Todo created successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Todo 
  // -----------------------------------------------------------
  updateTodo: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a todo
    const result = await updateTodo(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Todo updated successfully",
    });
  }),


  // -----------------------------------------------------------
  // Update a Todo position
  // -----------------------------------------------------------
  updateTodoPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a todo
    const result = await updateTodoPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Todo position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Todo 
  // -----------------------------------------------------------
  copyTodo: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a todo
    const result = await copyTodo(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a todo record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Todo copied successfully",
    });
  }),


  // -----------------------------------------------------------
  // Get all Todo 
  // -----------------------------------------------------------
  getTodos: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all todos
    const result = await getTodos();
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // -----------------------------------------------------------
  // Get a Todo by ID
  // -----------------------------------------------------------
  getTodoById: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get a specific todo
    const id = req.params.id;
    const result = await getTodoById(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // -----------------------------------------------------------
  // Reorder the Todo table
  // -----------------------------------------------------------
  reorderTodo: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the todo table
    const result = await reorderTodo();
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Todo reordered successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a Todo
  // ---------------------------------------------------------------------------
  deleteTodo: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const id = req.params.id;
    // Call the database services to delete a todo
    const result = await deleteTodo(id);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Todo deleted successfully",
    });
  })

};



