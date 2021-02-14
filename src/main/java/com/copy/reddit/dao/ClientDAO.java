package com.copy.reddit.dao;

import com.copy.reddit.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ClientDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ClientDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Client client) {
        jdbcTemplate.update("INSERT INTO Client (name, email, phone) values (?, ?, ?)",
                client.getName(), client.getEmail(), client.getPhone());
    }

    public List<Client> readAll() {
        return jdbcTemplate.query("SELECT * FROM Client", new BeanPropertyRowMapper<>(Client.class));
    }
    
    public boolean delete(int id) {
        return jdbcTemplate.update("DELETE FROM Client WHERE id=?", id) > 0;
    }

    public boolean update(Client client, int id) {
        return jdbcTemplate.update("UPDATE Client SET name=?, email=?, phone=? WHERE id=?",
                client.getName(), client.getEmail(), client.getPhone(), id) > 0;
    }

    public Client read(int id) {
        return jdbcTemplate.query("SELECT * FROM Client WHERE id=?",
                    new BeanPropertyRowMapper<>(Client.class), id)
                .stream().findFirst().orElse(null);
    }
}
