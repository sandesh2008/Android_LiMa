import db from "../config/database.js";
import bcrypt from "bcrypt";
const saltRounds = 10; // The number of salt rounds determines the complexity of the hash

import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";


//1.Student Sign In  //done
export const signin = async (req, res) => {
  var hashPassword;
  try {
    const { email, password } = req.body;
    console.log("email is " + email);
    console.log("password is " + password);

    const connection = db.openConnection2();

    const statement1 = `select password from student where email = '${email}'`;

    (await connection).query(statement1, async (error, result) => {
      if (error) {
        console.log(`error is ${error}`);
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else if (result.length == 0) {
        (await connection).end();
        return res
          .status(400)
          .json({ status: "error", error: "email not found" });
      } else {
        hashPassword = result[0].password;
        console.log(`hashPassword is ${hashPassword}`);
        console.log(`raw password is ${password}`);
        bcrypt.compare(password, hashPassword, async (err, result) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            (await connection).end();
            return res.status(400).json({
              status: "error",
              error: `Error comparing passwords: ${err}`,
            });
          } else if (result) {
            const statement2 = `
        select
          stud_id, first_name, last_name, mobile, email from student
        where
          email = '${email}' and 
          password = '${hashPassword}'`;
            console.log("Password is correct.");
            console.log(`statement 2 is ${statement2}`);
            (await connection).query(statement2, async (error, student) => {
              if (error) {
                console.log(`error is ${error}`);
                (await connection).end();
                return res
                  .status(400)
                  .json({ status: "error", error: error.message });
              } else {
                console.log("in signin else");
                console.log(student.length);
                const data = student[0];

                data.id = data.stud_id;
                delete data.stud_id;
                console.log(data);
                (await connection).end();
                return res.status(200).json({ status: "success", data });
              }
            });
          } else {
            console.log(`result is ${result}`);
            console.log("Password is incorrect.");

            (await connection).end();
            return res.status(400).json({
              status: "error",
              error: "email or password must be wrong!",
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//2.Student Profile
export const profile = async (req, res) => {
  try {
    const { stud_id } = req.params;

    const connection = db.openConnection2();

    const statement = `
  select
    stud_id, first_name, last_name, mobile, email from student
  where
    stud_id = '${stud_id}'
  `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else if (result.length == 0) {
        (await connection).end();
        return res
          .status(400)
          .json({ status: "error", error: "didn't get details..." });
      } else {
        const data = result[0];

        data.id = data.stud_id;
        delete data.stud_id;
        console.log(profile);
        (await connection).end();
        return res.status(200).json({ status: "success", data });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//3.Update Information
export const UpdateProfile = async (req, res) => {
  try {
    const { stud_id } = req.params;

    const { first_name, last_name, email, mobile, password } = req.body;

    console.log(first_name);
    console.log(last_name);
    console.log(email);
    const connection = db.openConnection2();

    const statement = `update student set first_name='${first_name}' ,last_name='${last_name}',email='${email}',mobile='${mobile}',password='${password}' where stud_id = '${stud_id}'`;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        (await connection).end();
        return res.status(200).json({ status: "success" });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//4.Student feedback
export const Feedback = async (req, res) => {
  try {
    const { stud_id } = req.params;

    const { feedback } = req.body;

    const connection = db.openConnection2();

    const statement = `
    insert into feedback(stud_id,feedback)
    values('${stud_id}','${feedback}')
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        (await connection).end();
        return res.status(200).json({ status: "success" });
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//5.Requesting for book // Need to handle the end connection
export const requestBook = async (req, res) => {
  try {
    const { stud_id } = req.params;

    const { book_id } = req.body;

    const connection = db.openConnection2();

    const issuedStatement = `select * from issued_book where book_id = ${book_id} and stud_id = ${stud_id}`;

    const requestStatement = `select * from request where book_id = ${book_id} and stud_id = ${stud_id}`;

    (await connection).query(requestStatement, async (error, result) => {
      console.log(`request is ${req}`);
      console.log(`error is ${error}`);
      if (error) {
        console.log(`error if is `);
        (await connection).end();
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        console.log(`length is ${result.length}`);
        if (result.length == 0) {
          (await connection).query(issuedStatement, async (error, Ibook) => {
            if (error) {
              (await connection).end();
              return res
                .status(400)
                .json({ status: "error", error: error.message });
            } else {
              if (Ibook.length == 0) {
                const statement = `
                insert into request
                (book_id , stud_id)
                values('${book_id}','${stud_id}')
                `;

                (await connection).query(statement, async (error, result) => {
                  if (error) {
                    (await connection).end();
                    return res
                      .status(400)
                      .json({ status: "error", error: error.message });
                  } else {
                    (await connection).end();
                    const data = result[0];
                    return res.status(200).json({ status: "success", data });
                  }
                });
              } else {
                (await connection).end();
                return res.status(401).json({
                  status: "error",
                  error:
                    "book you are trying to request is already issued by you!!",
                });
              }
            }
          });
        } else {
          console.log(`in else 400`);
          (await connection).end();
          return res.status(400).json({
            status: "error",
            error: "book you are trying to request is already requested!!",
          });
        }
      }
    });

    //(await connection).end();
  } catch (error) {
    console.log(`error is ${error}`);
    res.status(500).json({ status: false, message: error.message });
  }
};

//6.get Images
export const getBookImage = async (req, res) => {
  try {
    const { book_image } = req.params;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    console.log(`__dirname is ${__dirname}`);
    const path1 = __dirname + "/../uploads/" + book_image;
    console.log(`PATH IS ${path1}`);
    res.send(fs.readFileSync(path1));
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//7.View all books
export const allBooks = async (req, res) => {
  try {
    const connection = db.openConnection2();

    const statement = `
    select 
   book_id, 
   book_name, 
   book_category, 
   author, 
   publisher,
   book_price, 
   book_image,
   description 
   from book
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
            .json({ status: "error", error: "No books to show" });
        } else {
          var data = [];
          data.push(result);
          // const data = result;
          res.status(200).json({ status: "success", data });
          (await connection).end();
        }
        // const Books = result[0];
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//8.Viewing All issued books
export const issuedBooks = async (req, res) => {
  try {
    const { stud_id } = req.params;
    const connection = db.openConnection2();

    const statement = `
    select
                      ib.sr_no,
                      ib.stud_id,
                     ib.book_id as book_id,
                     b.book_name as book_name, 
                     b.book_category as book_category, 
                     b.author, 
                     b.publisher,
                     b.book_pdf, 
                     b.book_image,
                     ib.start_date, 
                     ib.end_date 
                     from issued_book ib inner join book b on ib.book_id = b.book_id where ib.stud_id = ${stud_id}
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
            .json({ status: "error", error: "No Book is issued to your id" });
        } else {
          var data = result;
          (await connection).end();
          return res.status(200).json({ status: "success", data });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

//9.Return Book//success is showing true after every send.
export const returnBook = async (req, res) => {
  try {
    const { book_id, stud_id } = req.params;
    const connection = db.openConnection2();

    const statement = `
    delete from issued_book 
    where stud_id = ${stud_id} and book_id = ${book_id}
    `;

    (await connection).query(statement, async (error, result) => {
      if (error) {
        (await connection).end();
        return res.status(400).json({
          status: "error",
          error: error.message,
        });
      } else {
        if (result.length == 0) {
          (await connection).end();
          return res.status(400).json({
            status: "error",
            error: "No book is issued to return or already returned the book.",
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

//10.get book pdf
export const getBookPdf = async (req, res) => {
  try {
    const { book_pdf } = req.params;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    console.log(`__dirname is ${__dirname}`);
    const path1 = __dirname + "/../uploads/" + book_pdf;
    console.log(`PATH IS ${path1}`);
    res.send(fs.readFileSync(path1));
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
