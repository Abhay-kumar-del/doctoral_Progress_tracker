package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.DcMeeting;
import com.example.SE.Project.Repository.DcMeetingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;


import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DcMeetingController.class)
public class DcMeetingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private DcMeetingRepository meetingRepo;

    private DcMeeting sampleMeeting;

    @BeforeEach
    void setUp() {
        sampleMeeting = new DcMeeting();
        sampleMeeting.setStudentName("Alice");
        sampleMeeting.setSupervisorName("Prof. Bob");
        sampleMeeting.setMeetingDate(LocalDate.now());
        sampleMeeting.setAgenda("Thesis Planning");
    }

    @Test
    public void testViewMeetings() throws Exception {
        when(meetingRepo.findAll()).thenReturn(Collections.singletonList(sampleMeeting));

        mockMvc.perform(get("/meetings"))
                .andExpect(status().isOk())
                .andExpect(view().name("meetings"))
                .andExpect(model().attributeExists("meetings"));
    }

    @Test
    public void testShowForm() throws Exception {
        mockMvc.perform(get("/meetings/new"))
                .andExpect(status().isOk())
                .andExpect(view().name("new_meeting"))
                .andExpect(model().attributeExists("meeting"));
    }

    @Test
    public void testSaveMeeting() throws Exception {
        mockMvc.perform(post("/meetings")
                        .param("studentName", "Alice")
                        .param("supervisorName", "Prof. Bob")
                        .param("meetingDate", "2025-04-07")
                        .param("agenda", "Thesis Planning"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/meetings"));
    }
}
