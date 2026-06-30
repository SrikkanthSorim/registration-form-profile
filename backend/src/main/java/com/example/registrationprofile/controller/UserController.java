package com.example.registrationprofile.controller;

import com.example.registrationprofile.dto.ApiResponse;
import com.example.registrationprofile.dto.LoginRequest;
import com.example.registrationprofile.dto.UserProfileResponse;
import com.example.registrationprofile.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam String name,
                                      @RequestParam String email,
                                      @RequestParam String password,
                                      @RequestParam String dob,
                                      @RequestParam MultipartFile image) {
        try {
            userService.register(name, email, password, dob, image);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "User registered successfully"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            UserProfileResponse profile = userService.login(request);
            return ResponseEntity.ok(profile);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, ex.getMessage()));
        }
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<?> profile(@PathVariable String email) {
        try {
            return ResponseEntity.ok(userService.getProfile(email));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, ex.getMessage()));
        }
    }

    @GetMapping("/colleagues/{email}")
    public ResponseEntity<?> colleagues(@PathVariable String email) {
        return ResponseEntity.ok(userService.getColleagues(email));
    }
}
