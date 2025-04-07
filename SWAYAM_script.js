document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector("main");
    const registerBtn = document.getElementById("register-btn");
    const myCoursesBtn = document.getElementById("my-courses-btn");
    const availableCoursesDiv = document.getElementById("Available-courses");
    const myCoursesDiv = document.getElementById("My-courses");

    menuBtn.addEventListener("click", function () {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    });

    closeBtn.addEventListener("click", function () {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    });

    registerBtn.addEventListener("click", function () {
        if (availableCoursesDiv.style.display === "none") {
            availableCoursesDiv.style.display = "block";
            myCoursesDiv.style.display = "none";
        } else {
            availableCoursesDiv.style.display = "none";
        }
    });

    myCoursesBtn.addEventListener("click", function () {
        if (myCoursesDiv.style.display === "none") {
            myCoursesDiv.style.display = "block";
            availableCoursesDiv.style.display = "none";
        } else {
            myCoursesDiv.style.display = "none";
        }
    });

    // Example available course data
    const availableCourses = [
        { name: "Course 1", duration: "10 weeks" },
        { name: "Course 2", duration: "8 weeks" },
        { name: "Course 3", duration: "12 weeks" }
    ];

    const availableCoursesContainer = document.getElementById("available-courses-list");

    // Add headings as the first entry for available courses
    const availableHeadingsElement = document.createElement("div");
    availableHeadingsElement.classList.add("course-entry", "headings");
    availableHeadingsElement.innerHTML = `
        <a>Course Name</a>
        <a>Duration</a>
        <a></a>
    `;
    availableCoursesContainer.appendChild(availableHeadingsElement);

    // Add available course entries
    availableCourses.forEach(course => {
        const courseElement = document.createElement("div");
        courseElement.classList.add("course-entry");
        courseElement.innerHTML = `
            <a>${course.name}</a>
            <a>${course.duration}</a>
            <button class="enroll-button">Request Enrollment</button>
        `;
        availableCoursesContainer.appendChild(courseElement);
    });

    // Example my course data
    const myCourses = [
        { name: "Course 1", duration: "10 weeks", status: "Enrolled" },
        { name: "Course 2", duration: "8 weeks", status: "Not Enrolled" },
        { name: "Course 3", duration: "12 weeks", status: "Enrolled" }
    ];

    const myCoursesContainer = document.getElementById("courses");

    // Add headings as the first entry for my courses
    const myHeadingsElement = document.createElement("div");
    myHeadingsElement.classList.add("course-entry", "headings");
    myHeadingsElement.innerHTML = `
        <a>Course Name</a>
        <a>Duration</a>
        <a>Status</a>
    `;
    myCoursesContainer.appendChild(myHeadingsElement);

    // Add my course entries
    myCourses.forEach(course => {
        const courseElement = document.createElement("div");
        courseElement.classList.add("course-entry");
        courseElement.innerHTML = `
            <a>${course.name}</a>
            <a>${course.duration}</a>
            <a>${course.status}</a>
        `;
        myCoursesContainer.appendChild(courseElement);
    });
});