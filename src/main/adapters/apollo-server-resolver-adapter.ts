import { Controller } from "@/presentation/protocols";

export const adaptResolver = async(controller: Controller, args: any): Promise<any> => {
    const { body } = await controller.handle(args)

    return body
}
