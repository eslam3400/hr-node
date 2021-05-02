const Model = require('../Model/Model')

// new Model().excute(`
//   CREATE TABLE pranchs(
//     id int AUTO_INCREMENT,
//     name varchar(255) NOT NULL,
//     PRIMARY KEY (id)
//   );
// `, () => console.log("Created The Pranchs Table"))

// new Model().excute(`ALTER TABLE users DROP COLUMN pranch;`, () => {
//   console.log("Deleted Column Pranch From Users Table")
//   new Model().excute(`ALTER TABLE users ADD pranch_id int`, () => {
//     console.log("Created The pranch_id Column In Users Table")
//     new Model().excute(`ALTER TABLE users ADD FOREIGN KEY (pranch_id) REFERENCES pranchs(id)`, () =>
//       console.log("Make The pranch_id Column Foreign Key"))
//   })
// })

new Model().excute(`
  CREATE TABLE jobs(
    id int AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id)
  );
`, () => {
  console.log("Created The Jobs Table")
  new Model().excute(`ALTER TABLE users ADD job_id int`, () => {
    console.log("Created The job_id Column In Users Table")
    new Model().excute(`ALTER TABLE users ADD FOREIGN KEY (job_id) REFERENCES jobs(id)`, () =>
      console.log("Make The job_id Column Foreign Key"))
  })
})
