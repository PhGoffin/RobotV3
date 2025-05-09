/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 09:40:29
 * @Description: All the controllers (call operations) for the API user
 */

const {
  createUser,
  getAllUsers,  
  linkProject,
  getUserByUserId,
  getUserByLogin,
  getFreeUsersByProject, 
  getLinkedUser, 
  updateLinkedUser,
  deleteLinkedUser,
  getUsersByProjectId,
  getUsersByWorkspaceId,
  getRoleOfUser,  
  isUserOnProject,
  updateUser,
  updatePassword,  
  deleteUser,
  unlinkProject  
} = require("./user.service");

const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");



module.exports = {

  // -----------------------------------------------------------
  // Insert a new user 
  // -----------------------------------------------------------
  createUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    // Call the database services to insert a user
    const result = await createUser(body);
    if (!result.affectedRows) {
      //throw new Error('Failed! Insert record');
      throw new AppError('Failed! Insert record', 200);

    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "User created successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // get all users
  // ---------------------------------------------------------------------------
  getAllUsers: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all the users
    const result = await getAllUsers();
    return res.json({
      success: 1,
      data: result
    });
  }),


  // -------------------------------------------------------------------------------------
  // link a user to a project
  // -------------------------------------------------------------------------------------
  linkProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to link a user to a project
    const result = await linkProject(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to link the user to a project!', 200);
    }
    return res.json({
      success: 1,
      message: "link projectsuccessfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Check if a user is linked to a project
  // ---------------------------------------------------------------------------
  isUserOnProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all users for a project
    const body = req.body;
    const result = await isUserOnProject(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // Get the role of a user for a project in a workspace
  // ---------------------------------------------------------------------------
  getRoleOfUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get the role of user for a project in a workspace
    const body = req.body;
    const result = await getRoleOfUser(body);
    if (!result.length) {
      //console.log ('no role detected!')
      throw new AppError('No role detected!', 200);
    }    
    return res.json({
      success: 1,
      data: result
    });
  }),
  
  // ---------------------------------------------------------------------------
  // Check the login/password of a user
  // ---------------------------------------------------------------------------
  login: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get all users
    const user = await getUserByLogin(body);

    if (!user.length) {
      //const err = new Error('Invalid username or password');
      throw new AppError('Invalid username or password', 200);

    }
    const result = compareSync(body.password, user[0].password);
    if (result) {
      delete user[0].password;
      const jsontoken = sign({ result: user[0] }, "qwe1234", {
        expiresIn: "1h"
      });

      return res.json({
        success: 1,
        message: "login successfully",
        data: user,
        token: jsontoken
      });
    } else {
      //throw new Error("Invalid username or password");
      throw new AppError('Invalid username or password', 200);
    }
  }),

  // ---------------------------------------------------------------------------
  // get user info by the ID
  // ---------------------------------------------------------------------------
  getUserByUserId: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a specific user
    const body = req.body;
    const result = await getUserByUserId(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get user info by the Login
  // ---------------------------------------------------------------------------
  getUserByLogin: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a specific user by the login
    const body = req.body;
    const result = await getUserByLogin(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get free users (users not linked to a project)
  // ---------------------------------------------------------------------------
  getFreeUsersByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all free users by the project
    const body = req.body;
    const result = await getFreeUsersByProject(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get detail of a linked user (users linked to a project)
  // ---------------------------------------------------------------------------
  getLinkedUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all free users by the project
    const id = req.params.id;
    const result = await getLinkedUser(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // update linked user (users linked to a project)
  // ---------------------------------------------------------------------------
  updateLinkedUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to update a linked user
    const body = req.body;
    const result = await updateLinkedUser(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // delete a linked user (users linked to a project)
  // ---------------------------------------------------------------------------
  deleteLinkedUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to delete a linked user
    const body = req.body;
    const result = await deleteLinkedUser(body);
    if (!result.affectedRows) {
      //throw new Error(`Failed to delete record!`);
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "linked user deleted successfully",
    });
  }),



  // ---------------------------------------------------------------------------
  // get all users by a project
  // ---------------------------------------------------------------------------
  getUsersByProjectId: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all users for a project
    const body = req.body;
    const result = await getUsersByProjectId(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get all users by workspace
  // ---------------------------------------------------------------------------
  getUsersByWorkspaceId: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all users for a workspace
    const id = req.params.id;
    const result = await getUsersByWorkspaceId(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // -------------------------------------------------------------------------------------
  // update user info 
  // Note: the password is not updated by this function (you have to use updatePassword)
  // -------------------------------------------------------------------------------------
  updateUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a user
    const result = await updateUser(body);
    if (!result.affectedRows) {
      //throw new Error(`Failed to update record!`);
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Updated successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // update the password
  // the password is encrypted before sending data into the database
  // ---------------------------------------------------------------------------
  updatePassword: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    // Call the database services to update a user
    const result = await updatePassword(body);
    if (!result.affectedRows) {
      //throw new Error(`Failed to update record!`);
      throw new AppError('Failed to update password!', 200);
    }
    return res.json({
      success: 1,
      message: "Password updated successfully",
    });
  }),



  // ---------------------------------------------------------------------------
  // Delete a user
  // ---------------------------------------------------------------------------
  deleteUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to delete a user
    const body = req.body;
    const result = await deleteUser(body);
    if (!result.affectedRows) {
      //throw new Error(`Failed to delete record!`);
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "User deleted successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a user in all the linked projects
  // ---------------------------------------------------------------------------
  unlinkProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to delete a user in all the project link
    const body = req.body;
    const result = await unlinkProject(body);
    if (!result.affectedRows) {
      //throw new Error(`Failed to delete record!`);
      throw new AppError('Failed to unlink user to project(s)!', 200);
    }
    return res.json({
      success: 1,
      message: "User unlinked to project(s) successfully",
    });
  }),

};
