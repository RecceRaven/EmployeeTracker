const mysql = require('mysql2');
const express = require('express');
const inquirer = require('inquirer');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '6666',
  database: 'employee_db',
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the employee_db database');
  startApplication();
});

// Function to start the application
function startApplication() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;

        case 'View all roles':
          viewRoles();
          break;

        case 'View all employees':
          viewEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          connection.end();
          break;
      }
    });
}

// VIEW DEPARTMENTS
function viewDepartments() {
    const query = 'SELECT * FROM department';
  
    connection.query(query, (err, results) => {
      if (err) throw err;
  
      console.log('\n=== Departments ===');
      console.table(results);
      startApplication();
    });
}

// VIEW ROLES
function viewRoles() {
    const query = 'SELECT * FROM role';
  
    connection.query(query, (err, results) => {
      if (err) throw err;
  
      console.log('\n=== Roles ===');
      console.table(results);
      startApplication();
    });
}

// VIEW EMPLOYEES
function viewEmployees() {
    const query = 'SELECT * FROM employee';
  
    connection.query(query, (err, results) => {
      if (err) throw err;
  
      console.log('\n=== Employees ===');
      console.table(results);
      startApplication();
    });
}

// ADD DEPARTMENT
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:',
      validate: (input) => {
        if (input.trim() !== '') {
          return true;
        }
        return 'Please enter a valid department name.';
      },
    })
    .then((answers) => {
      const departmentName = answers.departmentName;
      const query = 'INSERT INTO department (name) VALUES (?)';
      const values = [departmentName];

      connection.query(query, values, (err) => {
        if (err) throw err;

        console.log(`\nDepartment '${departmentName}' added successfully.\n`);
        startApplication();
      });
    });
}

// ADD ROLE
function addRole() {
    const departmentQuery = 'SELECT id, name FROM department';
    connection.query(departmentQuery, (err, departments) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the new role:',
            validate: (input) => {
              if (input.trim() !== '') {
                return true;
              }
              return 'Please enter a valid role name.';
            },
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for the new role:',
            validate: (input) => {
              const isValid = !isNaN(parseFloat(input)) && isFinite(input) && parseFloat(input) >= 0;
              return isValid || 'Please enter a valid positive salary.';
            },
          },
          {
            type: 'list',
            name: 'roleDepartment',
            message: 'Select the department for the new role:',
            choices: departments.map((department) => ({ name: department.name, value: department.id })),
          },
        ])
        .then((answers) => {
          const roleName = answers.roleName;
          const roleSalary = parseFloat(answers.roleSalary);
          const roleDepartmentId = answers.roleDepartment;

          const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
          const values = [roleName, roleSalary, roleDepartmentId];

          connection.query(query, values, (err) => {
            if (err) throw err;

            console.log(`\nRole '${roleName}' added successfully.\n`);
            startApplication();
          });
        });
    });
}

// ADD EMPLOYEE
function addEmployee() {
  const roleQuery = 'SELECT id, title FROM role';
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee';

  connection.query(roleQuery, (err, roles) => {
    if (err) throw err;

    connection.query(employeeQuery, (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the new employee:',
            validate: (input) => {
              if (input.trim() !== '') {
                return true;
              }
              return 'Please enter a valid first name.';
            },
          },
          {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the new employee:',
            validate: (input) => {
              if (input.trim() !== '') {
                return true;
              }
              return 'Please enter a valid last name.';
            },
          },
          {
            type: 'list',
            name: 'employeeRole',
            message: 'Select the role for the new employee:',
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
          {
            type: 'list',
            name: 'employeeManager',
            message: 'Select the manager for the new employee:',
            choices: [{ name: 'None', value: null }, ...employees.map((employee) => ({ name: employee.full_name, value: employee.id }))]
          },
        ])
        .then((answers) => {
          const firstName = answers.firstName;
          const lastName = answers.lastName;
          const employeeRole = answers.employeeRole;
          const employeeManager = answers.employeeManager;

          const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          const values = [firstName, lastName, employeeRole, employeeManager];

          connection.query(query, values, (err) => {
            if (err) throw err;

            console.log(`\nEmployee '${firstName} ${lastName}' added successfully.\n`);
            startApplication();
          });
        });
    });
  });
}

// UPDATE EMPLOYEE ROLE
function updateEmployeeRole() {
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee';
  const roleQuery = 'SELECT id, title FROM role';

  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;

    connection.query(roleQuery, (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeToUpdate',
            message: 'Select the employee to update:',
            choices: employees.map((employee) => ({ name: employee.full_name, value: employee.id })),
          },
          {
            type: 'list',
            name: 'newRole',
            message: 'Select the new role for the employee:',
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
        ])
        .then((answers) => {
          const employeeId = answers.employeeToUpdate;
          const newRoleId = answers.newRole;

          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          const values = [newRoleId, employeeId];

          connection.query(query, values, (err) => {
            if (err) throw err;

            console.log('\nEmployee role updated successfully.\n');
            startApplication();
          });
        });
    });
  });
}
