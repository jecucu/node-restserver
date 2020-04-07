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
    console.log(usuario)
    console.log('***TRAZA 1 ***')
    if (usuario.role != 'ADMIN_ROLE') {
        console.log('***TRAZA 2 ***')
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Role invalido'
            }
        })
    }
    console.log('***TRAZA 3 ***')
    next();

}

module.exports = {
    verificaToken: verificaToken,
    verificaUsuario: verificaUsuario
};