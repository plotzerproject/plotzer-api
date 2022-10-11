//https://jsonapi.org/format/#errors-processing ver dps e atualizar

class Errors {
    static lastId = 0;
    id;    

    constructor(){
        this.id = ++Errors.lastId
    }

    createError(_title, _detail, _status){
        return {
            id: this.id,
            title: _title,
            detail: _detail,
            status: _status,
        }
    }
}

/*
 * create
 * get
 * update
 * delete
 * not found
 * ?already exists
 */

//User
export const errCreateUser = new Errors().createError("Falha no cadastro", "Um erro ocorreu ao cadastrar um usuario", 500)

export const errGetUser = new Errors().createError("Falha na requisição", "Ocorreu um erro ao receber o(s) usuário(s)", 500)

export const errUpdateUser = new Errors().createError("Falha na requisição", "Um erro ocorreu ao editar um usuário", 500)

export const errDeleteUser = new Errors().createError("Falha na requisição", "Um erro ocorreu ao deletar um usuário", 500)

export const errUserNotFound = new Errors().createError("Falha na requisição", "Nenhum usuário foi encontrado", 404)

export const errUserAlreadyExists = new Errors().createError("Falha na requisição", "Este e-mail ja está cadastrado.", 500)

export const errUserIncorrect = new Errors().createError("Valores Inválidos", "E-mail ou senha incorretos!", 404)

export const errActionsLikeSomeoneElse = new Errors().createError("Falha na requisição", "Você não pode realizar ações como outro usuário!", 500)

export const errIncorrectData = new Errors().createError("Falha na requisição", "Respeite o formato de requisição", 422)

//Plan
export const errCreatePlan = new Errors().createError("Falha no cadastro", "Um erro ocorreu ao cadastrar este plano", 500)

export const errGetPlan = new Errors().createError("Falha na requisição", "Ocorreu um erro ao receber os planos", 500)

export const errUpdatePlan = new Errors().createError("Falha na requisição", "Um erro ocorreu ao editar um plano", 500)

export const errDeletePlan = new Errors().createError("Falha na requisição", "Um erro ocorreu ao deletar um plano", 500)

export const errPlanNotFound = new Errors().createError("Falha na requisição", "Nenhum plano foi encontrado", 404)

//Team
export const errCreateTeam = new Errors().createError("Falha no cadastro", "Um erro ocorreu ao cadastrar esta equipe", 500)

export const errGetTeam = new Errors().createError("Falha na requisição", "Ocorreu um erro ao receber a(s) equipe(s)", 500)

export const errUpdateTeam = new Errors().createError("Falha na requisição", "Um erro ocorreu ao editar uma equipe", 500)

export const errDeleteTeam = new Errors().createError("Falha na requisição", "Um erro ocorreu ao deletar uma equipe", 500)

export const errTeamNotFound = new Errors().createError("Falha na requisição", "Nenhuma equipe foi encontrada", 404)

export const errUserLimitTeams = new Errors().createError("Falha no cadastro", "O Usuário ja esgotou seu limite de equipes", 404)

export const errAddMemberTeam = new Errors().createError("Falha na requisição", "ocorreu um erro ao adicionar este membro na equipe!", 500)

export const errUserIsntOnTheTeam = new Errors().createError("Dados Inválidos", "Este usuário não se encontra nesta equipe ou não existe, digite novamente!", 422)

export const errUserDontHaveATeam = new Errors().createError("Dados Inválidos", "Este usuário não faz parte de nenhuma equipe!", 422)

export const errRemoveMemberTeam = new Errors().createError("Falha na requisição", "ocorreu um erro ao remover este membro na equipe!", 500)

export const errLeaveTeam = new Errors().createError("Request Failed", "Ocorreu um erro ao sair da equipe!", 500)

export const errUserIsAlreadyInTheTeam = new Errors().createError("Invalid Data", "Este usuário ja se encontra na equipe, adicione outro!", 422)


//Token
export const errNeedsToken = new Errors().createError("Token is missing", "Insira um token para prosseguir", 401)

export const errUserTokenNotFound = new Errors().createError("Falha na requisição", "Usuário ou Token não encontrado", 404)

export const errTokenInvalid = new Errors().createError("Invalid Token", "Este token ja expirou ou não existe, tente logar novamente!", 401)

export const errCreateToken = new Errors().createError("Falha na requisição", "Ocorreu um erro ao criar seu token!", 500)

export const errLogIn = new Errors().createError("Falha na requisição", "Ocorreu um erro ao realizar o login!", 500)

//Transaction

//Application
export const errUnauthorized = new Errors().createError("Falha na requisição", "Sem autorização!", 401)

export const errApplication = new Errors().createError("Falha na requisição", "Ocorreu um erro ao processar sua requisição", 500)