package com.example.registrationprofile.dto;

import java.time.LocalDate;

public class UserProfileResponse {
    private Long employeeId;
    private String name;
    private String email;
    private LocalDate dob;
    private String imageUrl;

    public UserProfileResponse(Long employeeId, String name, String email, LocalDate dob, String imageUrl) {
        this.employeeId = employeeId;
        this.name = name;
        this.email = email;
        this.dob = dob;
        this.imageUrl = imageUrl;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public LocalDate getDob() {
        return dob;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}
