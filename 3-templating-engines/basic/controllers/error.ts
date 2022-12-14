import { Request, Response, NextFunction } from "express";

function get404(_: Request, res: Response, __: NextFunction) {
  res.status(404).render("404", {
    docTitle: "Page Not Found",
    path: "/404",
  });
}

export default {
  get404,
};
