package com.example.SE.Project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableWebSecurity

public class SeProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(SeProjectApplication.class, args);
	}

}
