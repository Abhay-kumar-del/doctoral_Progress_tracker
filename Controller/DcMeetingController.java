package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.DcMeeting;
import com.example.SE.Project.Repository.DcMeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class DcMeetingController {

    @Autowired
    private DcMeetingRepository meetingRepo;

    @GetMapping("/meetings")
    public String viewMeetings(Model model) {
        model.addAttribute("meetings", meetingRepo.findAll());
        return "meetings";
    }

    @GetMapping("/meetings/new")
    public String showForm(Model model) {
        model.addAttribute("meeting", new DcMeeting());
        return "new_meeting";
    }

    @PostMapping("/meetings")
    public String saveMeeting(@ModelAttribute DcMeeting meeting) {
        meetingRepo.save(meeting);
        return "redirect:/meetings";
    }
}
