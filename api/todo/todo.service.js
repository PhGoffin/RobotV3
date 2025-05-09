const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-01-17
   * @Last Modified by: 
   * @Last Modified time: 2024-01-09 07:30:21
   * @Description: All the database services available for the API todo
   */

  // -----------------------------------------------------------
  // Insert todo info into the table todo
  // -----------------------------------------------------------
  createTodo: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO todo( todo, position) VALUES(?,?)`,
        [
          data.todo,
          data.position
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // -----------------------------------------------------------
  // Update todo info
  // -----------------------------------------------------------
  updateTodo: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE todo SET todo = ? WHERE todoID = ?`,
        [
          data.todo,
          data.todoID
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // -----------------------------------------------------------
  // Update todo position
  // -----------------------------------------------------------
  updateTodoPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE todo SET position = ? WHERE todoID = ?`,
        [
          data.position,
          data.todoID
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // -----------------------------------------------------------
  // Copy a todo record
  // -----------------------------------------------------------
  copyTodo: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO todo ( todo, position )
        SELECT t1.todo, ? FROM todo t1 WHERE t1.todoID = ?`,
        [
          data.position,
          data.todoID
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // -----------------------------------------------------------
  // get all todos
  // -----------------------------------------------------------
  getTodos: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT todoID, todo, position FROM todo ORDER BY position`,
        [],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // -----------------------------------------------------------
  // get a specific todo
  // -----------------------------------------------------------
  getTodoById: (todoID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT todoID, todo, position FROM todo WHERE todoID = ?`,
        [todoID],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // -----------------------------------------------------------
  // reorder all todos
  // -----------------------------------------------------------

  reorderTodo: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE todo AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, todoID,  LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3 
          FROM todo,
         (SELECT @row_number:=0) as t
          ORDER BY  pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.todoID = T2.todoID;`,
        [],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // ---------------------------------------------------------------------------
  // Delete a todo
  // ---------------------------------------------------------------------------
  deleteTodo: (todoID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM todo WHERE todoID = ?`,
        [ todoID ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  }




};
