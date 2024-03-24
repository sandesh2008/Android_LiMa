import express from "express";
import multer from "multer";
import { Asignin, acceptRequest, addBook, addStudent, allRequests, deleteBook, deleteStudent, feedback, issueBook, retrieveBook, viewBooks, viewIssuedBooks, viewStudents } from "../controllers/Admin.js";
import { issuedBooks } from "../controllers/Student.js";

const upload = multer({dest : 'uploads'});

const fileUpload = upload.fields([{ name: 'book_image',maxCount:1 },{ name: 'book_pdf',maxCount:1 }])


const router = express.Router();
//1
router.route("/asignin").post(Asignin)
//2
router.route("/addBook").post(fileUpload,addBook);
//3
router.route("/addStudent").post(addStudent);
//4
router.route("/allStudents").get(viewStudents);
//5
router.route("/deleteStudent/:stud_id").delete(deleteStudent);
//6
router.route("/viewBooks").get(viewBooks);
//7
router.route("/deleteBook/:book_id").delete(deleteBook);
//8
router.route("/allIssuedBooks").get(viewIssuedBooks);
//9
router.route("/retrieve/:stud_id/:book_id").delete(retrieveBook);
//10
router.route("/feedback").get(feedback);
//11
router.route("/allRequests").get(allRequests);
//12
router.route("/acceptRequest/:req_id").delete(acceptRequest);

//router.route("/issueRequest").put(acceptRequest);
//13
router.route("/issueBook").post(issueBook);




//router.route("/profile/:stud_id").get(profile);




export default router;