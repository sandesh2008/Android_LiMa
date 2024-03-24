import db from "../config/database.js";
import bcrypt from "bcrypt";
const saltRounds = 10; // The number of salt rounds determines the complexity of the hash

//1. Sign in
export const Asignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email is " + email);
    console.log("password is " + password);

    const connection = db.openConnection2();

    const statement = `
          select
            adminId, firstName, lastName, mobile, email from admin
          where
            email = '${email}' and 
            password = '${password}'`;

    (await connection).query(statement, async (error, admins) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else if (admins.length == 0) {
        (await connection).end();
        return res
          .status(400)
          .json({ status: "error", error: "Admin not found" });
      } else {
        const data = admins[0];

        data.id = data.admin_id;
        delete data.admin_id;

        (await connection).end();
        return res.status(200).json({ status: "success", data });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//2. Adding Book

export const addBook = async (req, res) => {
  try {
    const {
      book_name,
      book_category,
      author,
      publisher,
      book_price,
      description,
    } = req.body;

    const imageName = req.files.book_image[0].filename;
    const pdfName = req.files.book_pdf[0].filename;

    console.log(imageName);
    console.log(pdfName);

    const connection = db.openConnection2();

    const statement = `
      insert into book
      (book_name,book_category,author,publisher,book_price,book_image,description,book_pdf) 
   values
   ('${book_name}','${book_category}','${author}','${publisher}','${book_price}','${imageName}','${description}','${pdfName}')`;

    (await connection).query(statement, async (error, books) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        (await connection).end();
        return res
          .status(200)
          .json({ status: "success", data: "Book added successfully." });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//3. Adding Student
export const addStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    const connection = db.openConnection2();

    const emailStatement = `select email from student where email = '${email}'`;

    (await connection).query(emailStatement, async (error, emails) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        if (emails.length == 0) {
          bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
              console.error("Error generating hash:", err);
              (await connection).end();
              return res
                .status(400)
                .json({ status: "error", error: error.message });
            } else {
              console.log("student Hashed Password:", hash);

              const statement = `
        insert into student
            (firstName,lastName,email,mobile,password)
        values
            ('${firstName}','${lastName}','${email}','${mobile}','${hash}')
        `;

              (await connection).query(statement, async (error, result) => {
                if (error) {
                  (await connection).end();
                  return res
                    .status(400)
                    .json({ status: "error", error: error.message });
                } else {
                  (await connection).end();
                  return res.status(200).json({
                    status: "success",
                    data: "Student added successfully.",
                  });
                }
              });
            }
          });
        } else {
          res.status(200).json({
            status: "success",
            data: "email address already exists, please use another",
          });
          (await connection).end();
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//4. View Student Details
export const viewStudents = async (req, res) => {
  try {
    const connection = db.openConnection2();

    const statement = `
    select
    stud_id,
    first_name,
    last_name,
    email,
    mobile,
    password
   from student
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        //const students = result;
        console.log(`the students present are ${result}`);
        var data = [];
        data.push(result);

        // const data = result;
        (await connection).end();
        return res.status(200).json({ status: "success", data });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//5.delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { stud_id } = req.params;

    const connection = db.openConnection2();

    const statement = `
    delete from student 
    where stud_id = ${stud_id}
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        //const students = result;
        // console.log(`the student is delete=d with id ${stud_id}`);
        (await connection).end();
        return res.status(200).json({ status: "success", result });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//6. view book details
export const viewBooks = async (req, res) => {
  try {
    const connection = db.openConnection2();

    const statement = `
    select
    book_id,
    book_name,
    book_category,
    author,
    publisher,
    book_price
   from book
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        var data = [];
        data.push(result);
        (await connection).end();
        return res.status(200).json({ status: "success", data });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//7. Delete book
export const deleteBook = async (req, res) => {
  try {
    const { book_id } = req.params;
    console.log("book id is:" + book_id);

    const connection = db.openConnection2();

    const statement = `
    delete from book 
    where book_id = ${book_id}
    `;

    (await connection).query(statement, async (error, data) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        //const students = result;
        (await connection).end();
        return res.status(200).json({ status: "success", data });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//8. viewing issued books
export const viewIssuedBooks = async (req, res) => {
  try {
    const connection = db.openConnection2();

    const statement = `
    select
    ib.stud_id,
    b.book_id,
    b.book_name,
    b.book_category,
    b.author,
    ib.start_date,
    ib.end_date
    from book b
    inner join issued_book ib on b.book_id = ib.book_id  
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        const data = result;
        (await connection).end();
        return res.status(200).json({ status: "success", data });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//9. retrieve book from student
// need to be checked.
export const retrieveBook = async (req, res) => {
  try {
    const { stud_id, book_id } = req.params;

    const connection = db.openConnection2();

    const statement = `
     delete from issued_book 
     where stud_id = ${stud_id} and book_id = ${book_id}
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        //const students = result;
        (await connection).end();
        return res.status(200).json({
          status: "success",
          result,
          message: `book id ${book_id} is retrieved from student id ${stud_id}`,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//10. view student feedback
export const feedback = async (req, res) => {
  try {
    const connection = db.openConnection2();

    const statement = `
    select
    stud_id,
    feedback
    from feedback
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        if (result.length == 0) {
          (await connection).end();
          return res.status(401).json({
            status: "error",
            error: "No feedback is present.",
          });
        } else {
          (await connection).end();
          var data = [];
          data.push(result);
          return res.status(200).json({ status: "success", data });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//11. All Request
export const allRequests = async (req, res) => {
  try {
    const connection = db.openConnection2();

    const statement = `
    select
        req_id,
        stud_id,
        book_id
       from request
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        if (result.length == 0) {
          (await connection).end();
          return res.status(401).json({
            status: "error",
            error: "Their are no requests from any student",
          });
        } else {
          (await connection).end();

          // data.id = data.req_id;
          // delete result.req_id;
          var data = [];
          data.push(result);
          return res.status(200).json({ status: "success", data });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//12. Accept the request
export const acceptRequest = async (req, res) => {
  try {
    const { req_id } = req.params;

    const connection = db.openConnection2();

    //for deleting the request from request table.
    const statement = `
    delete from request where req_id = ${req_id}
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        if (result.length == 0) {
          (await connection).end();
          return res
            .status(401)
            .json({ status: "error", error: "Their is no requests to accept" });
        } else {
          (await connection).end();
          return res.status(200).json({ status: "success", result });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//13. issue book for student
export const issueBook = async (req, res) => {
  try {
    const { stud_id, book_id, start_date, end_date } = req.body;

    const connection = db.openConnection2();

    const statement = `
    insert into issued_book
    (stud_id,book_id,start_date,end_date)
 values(${stud_id}, ${book_id},'${start_date}','${end_date}')
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        if (result.length == 0) {
          (await connection).end();
          return res.status(401).json({
            status: "error",
            error: "Their are no requests remained to issue.",
          });
        } else {
          (await connection).end();
          return res.status(200).json({ status: "success", result });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
