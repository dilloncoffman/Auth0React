import React, { useState, useEffect } from 'react';

function Courses(props) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/course', {
      headers: { Authorization: `Bearer ${props.auth.getAccessToken()}` },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((response) => setCourses(response.courses))
      .catch((error) => setCourses(error.message));
  }, []);

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
}

export default Courses;
