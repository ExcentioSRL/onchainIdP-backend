import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

export const Claim = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        console.log(data);
        switch (data) {
            case "userId":
                const request = ctx.switchToHttp().getRequest() as Request;
                const header = request.header("Authorization");

                if (!header) {
                    console.log("no header");
                    return null;
                }

                const chunks = header.split(" ");
                // extractTokenPayload(ctx.switchToHttp().getRequest());
                const payload = jwt.decode(chunks[1]);
                console.log(payload);

                return payload;
            default:
                return null;
        }
    }
);
