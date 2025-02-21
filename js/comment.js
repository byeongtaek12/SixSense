
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {orderBy, query} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "",
    authDomain: "", 
    projectId: "",
    storageBucket: "", 
    messagingSenderId: "",
    appId: "",
    measurementId:"" 
};
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const offset = new Date().getTimezoneOffset() * 60000;

fetch('comment.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('comments-section').innerHTML = data;
        loadComments();

        // comment.html이 로드된 후 버튼 클릭 이벤트 리스너 추가
        document.getElementById("makeComment").addEventListener("click", async function () {
            let name = document.getElementById('comment-name').value;
            let contents = document.getElementById('comment-contents').value;

            if (!name || !contents) {
                alert("이름과 내용을 모두 작성해주세요.");
                return;
            }


            let doc = {
                "name": name,
                "contents": contents,
                "date": (new Date(Date.now()-offset)).toISOString()
            };

            // 댓글 Firestore에 저장
            await addDoc(collection(db, "TeamPage"), doc);
            alert("저장완료");
            loadComments();
            document.getElementById('comment-name').value = '';
            document.getElementById('comment-contents').value = '';
        });
    })
    .catch(error => console.log(error));



async function loadComments() {
    const commentsSection = document.getElementById("comment-list");
    commentsSection.innerHTML = ''
    const querySnapshot = await getDocs(
        query(collection(db, "TeamPage"), orderBy("date", "desc"))
    );
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const commentElement = `
            <div class="comment-box">
            <div class="metadata">
                <span class="name">${data.name}</span>
                <span class="date">${data.date.split('T')[0]}</span>
            </div>
            <div class="comment">
                <span>${data.contents}</span>
            </div>
        </div>
            `
        commentsSection.innerHTML += commentElement;
    });
}
