package com.aerodesk.service;

import com.aerodesk.enums.UserRole;
import com.aerodesk.model.Ticket;
import com.aerodesk.model.User;
import com.aerodesk.repository.TicketRepository;
import com.aerodesk.repository.UserRepository;
import com.aerodesk.enums.TicketStatus;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.aerodesk.enums.TicketPriority;
import com.aerodesk.model.TicketHistory;
import com.aerodesk.repository.TicketHistoryRepository;

import java.util.Map;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketHistoryRepository ticketHistoryRepository;

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository,
            TicketHistoryRepository ticketHistoryRepository) {

        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.ticketHistoryRepository = ticketHistoryRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ticket not found"
                ));
    }

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Long id, Ticket updatedTicket) {

        Ticket ticket = getTicketById(id);

        ticket.setTitle(updatedTicket.getTitle());
        ticket.setDescription(updatedTicket.getDescription());
        ticket.setCategory(updatedTicket.getCategory());
        ticket.setPriority(updatedTicket.getPriority());
        ticket.setStatus(updatedTicket.getStatus());

        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {

        Ticket ticket = getTicketById(id);

        ticketRepository.delete(ticket);
    }

    public Ticket assignTechnician(Long ticketId, Long userId) {

        Ticket ticket = getTicketById(ticketId);
        String oldTechnician = ticket.getAssignedTechnician() == null
                ? "Unassigned"
                : ticket.getAssignedTechnician().getName();
        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Closed tickets cannot be assigned"
            );
        }

        User technician = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        if (technician.getRole() != UserRole.TECHNICIAN) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User must be a technician"
            );
        }

        ticket.setAssignedTechnician(technician);

        Ticket savedTicket = ticketRepository.save(ticket);

        addHistory(
                savedTicket,
                "TECHNICIAN_ASSIGNED",
                oldTechnician,
                technician.getName()
        );

        return savedTicket;
    }
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }
    public List<Ticket> getTicketsByPriority(TicketPriority priority) {
        return ticketRepository.findByPriority(priority);
    }

    public List<Ticket> getTicketsByTechnician(Long userId) {
        return ticketRepository.findByAssignedTechnicianId(userId);
    }
    public List<Ticket> getTicketsByCategory(String category) {
        return ticketRepository.findByCategoryIgnoreCase(category);
    }
    public Map<String, Long> getDashboardStats() {

        long totalTickets = ticketRepository.count();
        long openTickets = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgressTickets = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolvedTickets = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closedTickets = ticketRepository.countByStatus(TicketStatus.CLOSED);
        long criticalTickets = ticketRepository.countByPriority(TicketPriority.CRITICAL);

        return Map.of(
                "totalTickets", totalTickets,
                "openTickets", openTickets,
                "inProgressTickets", inProgressTickets,
                "resolvedTickets", resolvedTickets,
                "closedTickets", closedTickets,
                "criticalTickets", criticalTickets
        );
    }
    public Ticket updateStatus(Long id, TicketStatus newStatus) {

        Ticket ticket = getTicketById(id);
        TicketStatus currentStatus = ticket.getStatus();

        boolean validTransition =
                (currentStatus == TicketStatus.OPEN &&
                        newStatus == TicketStatus.IN_PROGRESS)

                        || (currentStatus == TicketStatus.IN_PROGRESS &&
                        newStatus == TicketStatus.RESOLVED)

                        || (currentStatus == TicketStatus.RESOLVED &&
                        newStatus == TicketStatus.CLOSED)

                        || (currentStatus == TicketStatus.RESOLVED &&
                        newStatus == TicketStatus.IN_PROGRESS);

        if (!validTransition) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid ticket status transition"
            );
        }

        ticket.setStatus(newStatus);

        Ticket savedTicket = ticketRepository.save(ticket);

        addHistory(
                savedTicket,
                "STATUS_CHANGED",
                currentStatus.name(),
                newStatus.name()
        );

        return savedTicket;
    }
    private void addHistory(
            Ticket ticket,
            String action,
            String oldValue,
            String newValue) {

        TicketHistory history = new TicketHistory();

        history.setTicket(ticket);
        history.setAction(action);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);

        ticketHistoryRepository.save(history);
    }
    public List<TicketHistory> getTicketHistory(Long ticketId) {
        getTicketById(ticketId);

        return ticketHistoryRepository
                .findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

}