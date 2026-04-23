package com.cutclub.api.domain.port;

import com.cutclub.api.domain.model.Corte;

/**
 * Puerto de salida (Outbound Port) para la persistencia de cortes.
 */
public interface CorteRepository {

    Corte save(Corte corte);
}
