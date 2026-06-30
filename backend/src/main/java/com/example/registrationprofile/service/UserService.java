package com.example.registrationprofile.service;

import com.example.registrationprofile.dto.LoginRequest;
import com.example.registrationprofile.dto.UserProfileResponse;
import com.example.registrationprofile.entity.User;
import com.example.registrationprofile.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void register(String name, String email, String password, String dob, MultipartFile image) throws IOException {
        if (isBlank(name) || isBlank(email) || isBlank(password) || isBlank(dob)) {
            throw new IllegalArgumentException("All fields are required");
        }

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Profile image is required");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = image.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + fileExtension;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        User user = new User();
        user.setName(name.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setPassword(password);
        user.setDob(LocalDate.parse(dob));
        user.setImageUrl("/uploads/profile-images/" + fileName);

        userRepository.save(user);
    }

    public UserProfileResponse login(LoginRequest request) {
        if (request == null || isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            throw new IllegalArgumentException("Email and password are required");
        }

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return toProfileResponse(user);
    }

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toProfileResponse(user);
    }

    public List<UserProfileResponse> getColleagues(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        return userRepository.findAll().stream()
                .filter(user -> !user.getEmail().equalsIgnoreCase(normalizedEmail))
                .map(this::toProfileResponse)
                .collect(Collectors.toList());
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getDob(), user.getImageUrl());
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
