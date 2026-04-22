package com.cutclub.api.infrastructure.adapter.service;

import com.cutclub.api.domain.service.CodificadorContrasena;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class CodificadorContrasenaImpl implements CodificadorContrasena {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public String codificar(String contrasenaPlana) {
        return encoder.encode(contrasenaPlana);
    }

    @Override
    public boolean verificar(String contrasenaPlana, String contrasenaHash) {
        return encoder.matches(contrasenaPlana, contrasenaHash);
    }
}
    