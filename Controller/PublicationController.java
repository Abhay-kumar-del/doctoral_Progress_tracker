package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.Publication;
import com.example.SE.Project.Repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PublicationController {

    @Autowired
    private PublicationRepository publicationRepo;

    @GetMapping("/publications")
    public String viewPublications(Model model) {
        model.addAttribute("publications", publicationRepo.findAll());
        return "publications";
    }

    @GetMapping("/publications/new")
    public String showForm(Model model) {
        model.addAttribute("publication", new Publication());
        return "new_publication";
    }

    @PostMapping("/publications")
    public String savePublication(@ModelAttribute Publication publication) {
        publicationRepo.save(publication);
        return "redirect:/publications";
    }
}
