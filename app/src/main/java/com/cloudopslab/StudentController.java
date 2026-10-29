package com.cloudopslab;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/build-info")
    public Map<String, String> buildInfo() {
        return Map.of(
            "buildNumber", System.getenv().getOrDefault("JENKINS_BUILD_NUMBER", "local"),
            "commit", System.getenv().getOrDefault("GIT_COMMIT", "unknown")
        );
    }
}
