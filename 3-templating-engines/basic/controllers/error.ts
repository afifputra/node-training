import { Request, Response, NextFunction } from "express";

function get404(req: Request, res: Response, next: NextFunction) {
  res.status(404).render("404", {
    docTitle: "Page Not Found",
    path: "/404",
  });
}

export default {
  get404,
};
