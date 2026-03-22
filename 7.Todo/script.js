const activityList = document.getElementById("activity")
const activities = ["Exercise", "Study", "Lunch", "Break", "Dinner", "Wake Up & Freshen Up", "DSA Practice", "Evening Walk", "Read / Revise Notes", "Sleep by 10 PM"]

activities.forEach(element => {
    const task = document.createElement('li');
    const list = document.createTextNode(element)
    task.appendChild(list)
    activityList.appendChild(task)
    task.addEventListener("click", () => {
        task.classList.toggle("done")
    })
});
