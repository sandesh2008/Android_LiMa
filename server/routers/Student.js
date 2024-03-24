import express from "express";
import { Feedback, UpdateProfile, allBooks, getBookImage, getBookPdf, issuedBooks, profile, requestBook, returnBook, signin } from "../controllers/Student.js";

const router = express.Router();

//1
router.route("/signin").post(signin);
//2
router.route("/profile/:stud_id").get(profile);
//3
router.route("/update/:stud_id").put(UpdateProfile);
//4
router.route("/feedback/:stud_id").post(Feedback);
//5
router.route("/request/:stud_id").post(requestBook);
//6
router.route("/image/:book_image").get(getBookImage);

//7
router.route("/viewBooks").get(allBooks)

//Should check it again after admin part is done
//8
router.route("/viewIssuedBooks/:stud_id").get(issuedBooks);

//should check after issuing the book
//9
router.route("/returnBook/:stud_id/:book_id/").delete(returnBook);

//10
router.route("/pdf/:book_pdf").get(getBookPdf);



export default router;