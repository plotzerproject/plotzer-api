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

export const errUserNotFound = new Errors().createError("ERR_USER_NOT_FOUND", "Nenhum usuário foi encontrado", 404)

export const errUserAlreadyExists = new Errors().createError("ERR_USER_EXISTS", "Este e-mail ja está cadastrado.", 500)

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
export const errCreateTeam = new Errors().createError("ERR_CREATE_TEAM", "Um erro ocorreu ao cadastrar esta equipe", 500)

export const errGetTeam = new Errors().createError("ERR_GET_TEAM", "Ocorreu um erro ao receber a(s) equipe(s)", 500)

export const errUpdateTeam = new Errors().createError("ERR_UPDATE_TEAM", "Um erro ocorreu ao editar uma equipe", 500)

export const errDeleteTeam = new Errors().createError("ERR_DELETE_TEAM", "Um erro ocorreu ao deletar uma equipe", 500)

export const errTeamNotFound = new Errors().createError("ERR_TEAM_NOT_FOUND", "Nenhuma equipe foi encontrada", 404)

export const errUserLimitTeams = new Errors().createError("ERR_USER_LIMIT_TEAMS", "O Usuário ja esgotou seu limite de equipes", 404)

export const errAddMemberTeam = new Errors().createError("ERR_ADD_MEMBER", "ocorreu um erro ao adicionar este membro na equipe!", 500)

export const errUserIsntPartOfTeam = new Errors().createError("ERR_USER_IS_NOT_PART_OF_TEAM", "Este usuário não se encontra nesta equipe ou não existe, digite novamente!", 422)

export const errUserDontHaveATeam = new Errors().createError("ERR_USER_DOES_NOT_HAVE_TEAM", "Este usuário não faz parte de nenhuma equipe!", 422)

export const errRemoveMemberTeam = new Errors().createError("ERR_REMOVE_MEMBER", "ocorreu um erro ao remover este membro na equipe!", 500)

export const errLeaveTeam = new Errors().createError("ERR_LEAVE_TEAM", "Ocorreu um erro ao sair da equipe!", 500)

export const errTeamRequestFailed = new Errors().createError("ERR_TEAM_REQUEST", "Ocorreu um erro ao prosseguir com a requisição!", 500)

export const errUserIsAlreadyInTheTeam = new Errors().createError("ERR_USER_IN_TEAM", "Este usuário ja se encontra na equipe, adicione outro!", 422)

export const errUserAlreadyInvited = new Errors().createError("ERR_ALREADY_INVITED", "Este usuário já foi convidado anteriormente!", 422)

export const errRemoveYourself = new Errors().createError("ERR_REMOVE_YOURSELF", "Você não pode remover a si mesmo!", 401)

export const errRemoveOwner = new Errors().createError("ERR_REMOVE_OWNER", "Você não pode remover o dono da equipe!", 401)

// export const errUserDidntAccepted = new Errors().createError("ERR_USER_DID_NOT_ACCEPTED", "Este usuario ainda não aceitou o convite!", 422)

export const errUserDoesntHavePermission = new Errors().createError("ERR_USER_PERMISSIONS", "Este usuário não possui permissão para fazer isto!", 401)

export const errUserIsntOnTheTeam = new Errors().createError("ERR_USER_IS_NOT_TEAM", "Este usuário não faz parte da equipe!", 401)

export const errSlugAlreadyExists = new Errors().createError("ERR_SLUG_EXISTS", "Este slug ja está cadastrado.", 500)

//Token
export const errNeedsToken = new Errors().createError("ERR_NEEDS_TOKEN", "Insira um token para prosseguir", 401)

export const errUserTokenNotFound = new Errors().createError("ERR_USER_TOKEN_NOT_FOUND", "Usuário ou Token não encontrado", 404)

export const errTokenInvalid = new Errors().createError("ERR_TOKEN_INVALID", "Este token ja expirou ou não existe, tente logar novamente!", 401)

export const errCreateToken = new Errors().createError("ERR_CREATE_TOKEN", "Ocorreu um erro ao criar seu token!", 500)

export const errLogIn = new Errors().createError("ERR_LOGIN", "Ocorreu um erro ao realizar o login!", 500)

//Assignments
export const errCreateAssignment = new Errors().createError("ERR_CREATE_ASSIGNMENT", "Um erro ocorreu ao cadastrar esta tarefa", 500)

export const errGetAssignment = new Errors().createError("ERR_GET_ASSIGNMENT", "Ocorreu um erro ao receber a(s) tarefas(s)", 500)

export const errUpdateAssignment = new Errors().createError("ERR_UPDATE_ASSIGNMENT", "Um erro ocorreu ao editar uma tarefas", 500)

export const errDeleteAssignment = new Errors().createError("ERR_DELETE_ASSIGNMENT", "Um erro ocorreu ao deletar uma tarefa", 500)

export const errAssignmentNotFound = new Errors().createError("ERR_ASSIGNMENT_NOT_FOUND", "Nenhuma tarefa foi encontrada", 404)

//Kanban
export const errCreateKanban = new Errors().createError("ERR_CREATE_KANBAN", "Um erro ocorreu ao cadastrar este kanban", 500)

export const errGetKanban = new Errors().createError("ERR_GET_KANBAN", "Ocorreu um erro ao receber o(s) kanban(s)", 500)

export const errUpdateKanban = new Errors().createError("ERR_UPDATE_KANBAN", "Um erro ocorreu ao editar este kanban", 500)

export const errDeleteKanban = new Errors().createError("ERR_DELETE_KANBAN", "Um erro ocorreu ao deletar este kanban", 500)

export const errKanbanNotFound = new Errors().createError("ERR_CARD_NOT_FOUND", "Nenhum kanban foi encontrado", 404)

//Application
export const errUnauthorized = new Errors().createError("ERR_UNAUTHORIZED", "Sem autorização!", 401)

export const errApplication = new Errors().createError("ERR_APPLICATION", "Ocorreu um erro ao processar sua requisição", 500)

export const errInvalidData = new Errors().createError("ERR_INVALID_DATA", "Existem campos em branco", 422)

export const errFunctionNotDone = new Errors().createError("ERR_FUNCTION_NOT_DONE", "Esta função não foi concluída, avise aos colaboradores!", 500)