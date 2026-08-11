package com.aerodesk.controller;

import com.aerodesk.model.Ticket;
import com.aerodesk.service.TicketService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.aerodesk.enums.TicketStatus;
import com.aerodesk.enums.TicketPriority;
import com.aerodesk.model.TicketHistory;
import com.aerodesk.model.TicketComment;
import java.util.Map;
import java.util.List;

@RestController
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/hello")
    public String hello() {
        return "AeroDesk IT is running!";
    }

    @GetMapping("/api/tickets")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/api/tickets/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PostMapping("/api/tickets")
    public Ticket createTicket(@Valid @RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @PutMapping("/api/tickets/{id}")
    public Ticket updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody Ticket updatedTicket) {

        return ticketService.updateTicket(id, updatedTicket);
    }

    @DeleteMapping("/api/tickets/{id}")
    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }

    @PutMapping("/api/tickets/{ticketId}/assign/{userId}")
    public Ticket assignTechnician(
            @PathVariable Long ticketId,
            @PathVariable Long userId) {

        return ticketService.assignTechnician(ticketId, userId);
    }
    @GetMapping("/api/tickets/status/{status}")
    public List<Ticket> getTicketsByStatus(@PathVariable TicketStatus status) {
        return ticketService.getTicketsByStatus(status);
    }
    @GetMapping("/api/tickets/priority/{priority}")
    public List<Ticket> getTicketsByPriority(@PathVariable TicketPriority priority) {
        return ticketService.getTicketsByPriority(priority);
    }

    @GetMapping("/api/tickets/technician/{userId}")
    public List<Ticket> getTicketsByTechnician(@PathVariable Long userId) {
        return ticketService.getTicketsByTechnician(userId);
    }
    @GetMapping("/api/tickets/category/{category}")
    public List<Ticket> getTicketsByCategory(@PathVariable String category) {
        return ticketService.getTicketsByCategory(category);
    }
    @GetMapping("/api/tickets/dashboard")
    public Map<String, Long> getDashboardStats() {
        return ticketService.getDashboardStats();
    }
    @PutMapping("/api/tickets/{id}/status/{status}")
    public Ticket updateTicketStatus(
            @PathVariable Long id,
            @PathVariable TicketStatus status) {

        return ticketService.updateStatus(id, status);
    }
    @GetMapping("/api/tickets/{id}/history")
    public List<TicketHistory> getTicketHistory(@PathVariable Long id) {
        return ticketService.getTicketHistory(id);
    }

    @PostMapping("/api/tickets/{ticketId}/comments")
    public TicketComment addComment(
            @PathVariable Long ticketId,
            @RequestParam Long userId,
            @RequestBody String message) {

        return ticketService.addComment(ticketId, userId, message);
    }

    @GetMapping("/api/tickets/{ticketId}/comments")
    public List<TicketComment> getTicketComments(
            @PathVariable Long ticketId) {

        return ticketService.getTicketComments(ticketId);
    }
}