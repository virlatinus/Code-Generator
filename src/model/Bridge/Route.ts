import Project from '../Schema/Project'
import Save from '../Service/Save'
import { ActionEnum } from './ActionEnum'
import IHandler from './IHandler'
import ToJava from './ToJava'

export default class Route {
    readonly service: ToJava

    constructor(service: ToJava) {
        this.service = service
    }

    call(action: ActionEnum, key: string, data: string, handler?: IHandler) {
        this.service.send(action, key, data, handler)
    }

    edit(file: string, data: string, handler?: IHandler) {
        this.call(ActionEnum.edit, file, data, handler)
    }

    get(route: string, data: string, handler?: IHandler) {
        this.call(ActionEnum.get, route, data, handler)
    }

    post(route: string, data: string, handler?: IHandler) {
        this.call(ActionEnum.post, route, data, handler)
    }

    read(file: string, data: string, handler?: IHandler) {
        this.call(ActionEnum.read, file, data, handler)
    }

    refresh(handler?: IHandler) {
        this.call(ActionEnum.refresh, '', '', handler)
    }

    save(project: Project, handler?: IHandler) {
        const text = Save.run(project)
        if (text) {
            this.write(Save.FileName, text, handler)
            return
        }

        if (handler) {
            handler(Save.fake)
        }
    }

    write(file: string, data: string, handler?: IHandler) {
        this.call(ActionEnum.write, file, data, handler)
    }

}
