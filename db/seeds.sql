-- Sample data for department table
INSERT INTO department (id, name) VALUES
(1, 'Sales'),
(2, 'Marketing'),
(3, 'Finance'),
(4, 'IT');

-- Sample data for role table
INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Sales Representative', 50000, 1),
(2, 'Sales Manager', 80000, 1),
(3, 'Marketing Coordinator', 45000, 2),
(4, 'Finance Analyst', 60000, 3),
(5, 'IT Specialist', 70000, 4);

-- Sample data for employee table
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Bob', 'Johnson', 3, 2),
(4, 'Alice', 'Brown', 4, NULL),
(5, 'Charlie', 'Williams', 5, 4);
