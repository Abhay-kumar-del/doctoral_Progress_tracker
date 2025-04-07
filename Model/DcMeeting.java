package com.example.SE.Project.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class DcMeeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String supervisorName;
    private LocalDate meetingDate;
    private String agenda;

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getSupervisorName() {
        return supervisorName;
    }
    public void setSupervisorName(String supervisorName) {
        this.supervisorName = supervisorName;
    }

    public LocalDate getMeetingDate() {
        return meetingDate;
    }
    public void setMeetingDate(LocalDate meetingDate) {
        this.meetingDate = meetingDate;
    }

    public String getAgenda() {
        return agenda;
    }
    public void setAgenda(String agenda) {
        this.agenda = agenda;
    }
}
