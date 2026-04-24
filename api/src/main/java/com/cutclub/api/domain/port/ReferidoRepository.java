package com.cutclub.api.domain.port;

import com.cutclub.api.domain.model.Referido;

/**
 * Puerto de salida (Outbound Port) para la persistencia de vínculos de referido.
 */
public interface ReferidoRepository {

    void guardar(Referido referido);
}
