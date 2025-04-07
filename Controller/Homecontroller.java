package com.example.SE.Project.Controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class Homecontroller {
    @RequestMapping("/")
    public String home() {
        return "redirect:/index.html";
    }

     @GetMapping("/home")
    public String homePage(@AuthenticationPrincipal OAuth2User user, Model model) {
        if (user != null) {
            model.addAttribute("name", user.getAttribute("name"));
            return "home"; 
        }
        return "redirect:/index.html"; 
    }
    
}
