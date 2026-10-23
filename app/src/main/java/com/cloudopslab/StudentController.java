package com.cloudopslab;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StudentController {

    @GetMapping("/students")
    public List<String> getStudents() {
        return List.of("Student 1", "Student 2", "Student 3");
    }

    @GetMapping("/health")
    public String health() {
        return "CloudOpsLab API is running";
    }
}
