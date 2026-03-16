package com.cutclub.api.infrastructure.config;

import com.cutclub.api.application.service.RegistrarClienteNuevoService;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.service.CodigoReferidoGenerator;
import com.cutclub.api.infrastructure.adapter.service.CodigoReferidoGeneratorImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public CodigoReferidoGenerator codigoReferidoGenerator() {
        return new CodigoReferidoGeneratorImpl();
    }

    @Bean
    public RegistrarClienteNuevoService registrarClienteNuevoService(
            ClienteRepository clienteRepository,
            CodigoReferidoGenerator codigoReferidoGenerator) {
        return new RegistrarClienteNuevoService(clienteRepository, codigoReferidoGenerator);
    }
}
