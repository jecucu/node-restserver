const jwt = require('jsonwebtoken');


// verificar token
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

};


let verificaUsuario = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Role invalido'
            }
        })
    }
    next();

}

module.exports = {
    verificaToken: verificaToken,
    verificaUsuario: verificaUsuario
};