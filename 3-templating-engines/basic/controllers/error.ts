import { Request, Response, NextFunction } from "express";

function get404(req: Request, res: Response, __: NextFunction) {
  const isLoggedIn = req.session?.isLoggedIn || false;

  res.status(404).render("404", {
    docTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: isLoggedIn,
  });
}

export default {
  get404,
};
