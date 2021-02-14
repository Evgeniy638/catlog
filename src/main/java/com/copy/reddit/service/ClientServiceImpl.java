package com.copy.reddit.service;

import com.copy.reddit.dao.ClientDAO;
import com.copy.reddit.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {
    private final ClientDAO clientDAO;

    @Autowired
    public ClientServiceImpl(ClientDAO clientDAO) {
        this.clientDAO = clientDAO;
    }


    @Override
    public void create(Client client) {
        clientDAO.save(client);
    }

    @Override
    public List<Client> readAll() {
        return clientDAO.readAll();
    }

    @Override
    public Client read(int id) {
        return clientDAO.read(id);
    }

    @Override
    public boolean update(Client client, int id) {
        return clientDAO.update(client, id);
    }

    @Override
    public boolean delete(int id) {
        return clientDAO.delete(id);
    }
}
