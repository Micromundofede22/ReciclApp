import {
  CollectorService,
  PointsWalletService,
  ShiftsService,
  ShiftsWalletService,
  UserService,
} from "../service/service.js";

export const getShifts = async (req, res) => {
  try {
    const result = await ShiftsService.get();
    if (!result) return res.sendRequestError("Petición incorrecta");

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const getByIdShift = async (req, res) => {
  try {
    const sid = req.params.sid;
    const result = await ShiftsService.getById(sid);
    if (!result) return res.sendRequestError("petición incorrecta");
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const createShift = async (req, res) => {
  try {
    const user = req.user.tokenInfo;
    const swid = req.params.swid;
    if (user.shiftsWallet.toString() != swid)
      return res.unauthorized("No autorizado");
    if (user.status === "inactive")
      return res.unauthorized(
        "Su cuenta está inactiva aún. Cargue los documentos requeridos para activarla"
      );

    const data = req.body;
    const shiftsWallet = await ShiftsWalletService.getById(swid);

    let totalPoints = 0;
    for (const key in shiftsWallet.productsToRecycled) {
      totalPoints = totalPoints + shiftsWallet.productsToRecycled[key].points;
    }

    if (totalPoints === 0)
      return res.sendRequestError(
        "Usted no tiene productos agregados para reciclar"
      );

    //turno en collecion turnos no confirmados
    const result = await ShiftsService.create({
      date: data.date,
      hour: data.hour,
      street: user.street,
      height: user.height,
      emailUser: user.email,
      recyclingNumber: user.recyclingNumber,
      productsToRecycled: shiftsWallet.productsToRecycled,
      points: totalPoints,
    });

    if (!result)
      return res.sendRequestError("Petición incorrecta, turno no agendado");

    //ingreso el turno en la billetera turnos del user
    const shift = { _id: result._id };
    shiftsWallet.shiftsNotConfirmed.push({ shift: shift });

    //borro los productos a reciclar del objeto productToRecycled de la shiftsWallet
    for (const key in shiftsWallet.productsToRecycled) {
      shiftsWallet.productsToRecycled[key].quantity = 0;
      shiftsWallet.productsToRecycled[key].points = 0;
    }

    await ShiftsWalletService.update({ _id: swid }, shiftsWallet);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateShiftConfirmedAdminCol = async (req, res) => {
  try {
    const sid = req.params.sid;
    const emailCollector = req.body.emailCollector;
    const shift = await ShiftsService.getById(sid);
    const emailUser = shift.emailUser;
    const collector = await CollectorService.getOne({ email: emailCollector });
    if (!collector) return res.sendRequestError("Collector no encontrado");
    const user = await UserService.getEmail({ email: emailUser });
    if (!user) return res.sendRequestError("User no encontrado");

    //shiftsWallet collector and user
    const swCollector_id = collector.shiftsWallet.toString();
    const shiftsWalletCollector = await ShiftsWalletService.getById(
      swCollector_id
    );
    const swUser_id = user.shiftsWallet.toString();
    const shiftsWalletUser = await ShiftsWalletService.getById(swUser_id);

    const shiftConfirmed = {
      _id: shift._id,
      state: "confirmed",
      collector: `${collector.first_name} ${collector.last_name}`,
      emailCollector: collector.email,
      collectionNumberCollector: collector.collectionNumber,
      done: false,
      date: shift.date,
      hour: shift.hour,
      street: shift.street,
      height: shift.height,
      emailUser: user.email,
      recyclingNumber: user.recyclingNumber,
      points: shift.points,
      activatedPoints: false,
    };

    shiftsWalletCollector.shiftsConfirmed.push({ shift: shiftConfirmed });
    shiftsWalletUser.shiftsConfirmed.push({ shift: shiftConfirmed });

    await ShiftsWalletService.update({ _id: swUser_id }, shiftsWalletUser);
    await ShiftsWalletService.update(
      { _id: swCollector_id },
      shiftsWalletCollector
    );
    await ShiftsService.delete(sid);

    res.sendSuccess("Turno confirmado");
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateShiftConfirmed = async (req, res) => {
  //solo recolectores
  try {
    const sid = req.params.sid;
    const collector = req.user.tokenInfo;
    const sw_id = collector.shiftsWallet.toString();
    if (collector.status === "inactive")
      return res.sendRequestError(
        "Su cuenta está inactiva. Comuníquese con su administrador asignado."
      );

    const shiftNotConfirmed = await ShiftsService.getById(sid); //turno del usuario
    const shiftsWalletCollector = await ShiftsWalletService.getById(sw_id);

    if (!shiftNotConfirmed) return res.sendRequestError("Petición incorrecta");

    const shift = {
      _id: shiftNotConfirmed._id.toString(), //solo guardo _id string
      state: "confirmed",
      collector: `${collector.first_name} ${collector.last_name}`,
      emailCollector: collector.email,
      collectionNumberCollector: collector.collectionNumber,
      date: shiftNotConfirmed.date,
      hour: shiftNotConfirmed.hour,
      street: shiftNotConfirmed.street,
      height: shiftNotConfirmed.height,
      emailUser: shiftNotConfirmed.emailUser,
      recyclingNumber: shiftNotConfirmed.recyclingNumber,
      points: shiftNotConfirmed.points,
      activatedPoints: shiftNotConfirmed.activatedPoints,
    };
    //COLLECTOR. ingreso el turno en la wallet
    shiftsWalletCollector.shiftsConfirmed.push({ shift: shift });
    const result = await ShiftsWalletService.update(
      { _id: sw_id },
      shiftsWalletCollector
    );

    //USER.ingreso el turno en la wallet
    const user = await UserService.getEmail({
      email: shiftNotConfirmed.emailUser,
    });
    const swUser_id = user.shiftsWallet.toString();
    const shiftsWalletUser = await ShiftsWalletService.getById(swUser_id);
    shiftsWalletUser.shiftsConfirmed.push({ shift: shift });

    shiftsWalletUser.shiftsNotConfirmed.forEach((item, index) => {
      if (item.shift._id.toString() == sid) {
        shiftsWalletUser.shiftsNotConfirmed.splice(index, 1);
      }
    });
    await ShiftsWalletService.update({ _id: swUser_id }, shiftsWalletUser);

    //elimino el turno de la coleccion general de turnos no confirmados
    await ShiftsService.delete(sid);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateShiftAbsent = async (req, res) => {
  try {
    const scid = req.params.scid;
    const collector = req.user.tokenInfo;
    const sw_idCollector = collector.shiftsWallet.toString();
    const shiftsWalletCollector = await ShiftsWalletService.getById(
      sw_idCollector
    );

    //sw collector
    await shiftsWalletCollector.shiftsConfirmed.forEach(async (item, index) => {
      if (item.shift._id.toString() === scid) {
        //sw user (shift pasa a array de absents)
        const emailUser = item.shift.emailUser;
        const user = await UserService.getEmail({ email: emailUser });
        if (!user) return res.sendRequestError("Petición incorrecta");
        const sw_idUser = user.shiftsWallet.toString();
        const shiftsWalletUser = await ShiftsWalletService.getById(sw_idUser);

        shiftsWalletUser.shiftsConfirmed.forEach(async (item, index) => {
          if (item.shift._id.toString() === scid) {
            item.shift.state = "absent";
            shiftsWalletUser.shiftsAbsents.push({ shift: item.shift });
            shiftsWalletUser.shiftsConfirmed.splice(index, 1);
          }
        });

        await ShiftsWalletService.update({ _id: sw_idUser }, shiftsWalletUser);

        //sw collector
        item.shift.state = "absent";
        shiftsWalletCollector.shiftsAbsents.push({ shift: item.shift });
        shiftsWalletCollector.shiftsConfirmed.splice(index, 1);

        await ShiftsWalletService.update(
          { _id: sw_idCollector },
          shiftsWalletCollector
        );
      }
    });

    res.sendSuccess(
      "Hemos avisado al USER que usted pasó por el domicilio, pero el estaba ausente."
    );
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateShiftReconfirm = async (req, res) => {
  try {
    const said = req.params.said;
    const data = req.body;
    const user = req.user.tokenInfo;
    const swUser_ID = user.shiftsWallet.toString();
    const shiftsWalletUser = await ShiftsWalletService.getById(swUser_ID);

    shiftsWalletUser.shiftsAbsents.forEach(async (item, index) => {
      if (item.shift._id.toString() === said) {
        //data collector
        const emailCollector = item.shift.emailCollector;
        const collector = await CollectorService.getOne({
          email: emailCollector,
        });
        const sw_idCollector = collector.shiftsWallet.toString();
        const shiftsWalletCollector = await ShiftsWalletService.getById(
          sw_idCollector
        );

        shiftsWalletCollector.shiftsAbsents.forEach(async (item, index) => {
          if (item.shift._id.toString() === said) {
            item.shift.state = "reconfirm-pending";
            item.shift.date = data.date;
            item.shift.hour = data.hour;
          }
        });
        await ShiftsWalletService.update(
          { _id: sw_idCollector },
          shiftsWalletCollector
        );

        item.shift.state = "reconfirm-pending";
        item.shift.date = data.date;
        item.shift.hour = data.hour;

        await ShiftsWalletService.update({ _id: swUser_ID }, shiftsWalletUser);
      }
    });
    res.sendSuccess(
      "Hemos informado al collector asignado sobre su reconfirmación de turno. Espere la reconfirmación de su parte."
    );
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateShiftReconfirmCollector = async (req, res) => {
  try {
    const collector = req.user.tokenInfo;
    const srcid = req.params.srcid;
    const data = req.body.accept; //accept= true or false
    const sw_idCollector = collector.shiftsWallet.toString();
    const shiftsWalletCollector = await ShiftsWalletService.getById(
      sw_idCollector
    );

    await shiftsWalletCollector.shiftsAbsents.forEach(async (item, index) => {
      if (item.shift._id.toString() === srcid) {
        //data user
        const emailUser = item.shift.emailUser;
        const user = await UserService.getEmail({ email: emailUser });
        const swUser_ID = user.shiftsWallet.toString();
        const shiftsWalletUser = await ShiftsWalletService.getById(swUser_ID);

        //si collector confirma el turno reconfirmado
        if (data === true) {
          //sw user
          shiftsWalletUser.shiftsAbsents.forEach(async (item, index) => {
            if (item.shift._id.toString() === srcid) {
              item.shift.state = "reconfirmed";
              shiftsWalletUser.shiftsConfirmed.push({ shift: item.shift });
              shiftsWalletUser.shiftsAbsents.splice(index, 1);
              await ShiftsWalletService.update(
                { _id: swUser_ID },
                shiftsWalletUser
              );
            }
          });
          //sw collector
          item.shift.state = "reconfirmed";
          shiftsWalletCollector.shiftsConfirmed.push({ shift: item.shift });
          shiftsWalletCollector.shiftsAbsents.splice(index, 1);
          await ShiftsWalletService.update(
            { _id: sw_idCollector },
            shiftsWalletCollector
          );
          return res.sendSuccess("Turno reconfirmado ok");
        }

        //si collector rechaza el pedido de reconfirmación del turno
        if (data === false) {
          //data admincollector(allí se manda el turno cancelado por collector, asi se le reasigna un nuevo collector al user)
          const emailAdminCollector = collector.adminCollector;
          const adminCollector = await CollectorService.getOne({
            email: emailAdminCollector,
          });
          const swAC_id = adminCollector.shiftsWallet.toString();
          const shiftsWalletAdminCollector = await ShiftsWalletService.getById(
            swAC_id
          );

          //sw user
          shiftsWalletUser.shiftsAbsents.forEach(async (item, index) => {
            if (item.shift._id.toString() === srcid) {
              item.shift.state = "reconfirm-cancelled";
              //tendrá un plazo de 24 hs para que el admincollector le reasigne un nuevo collector
              shiftsWalletUser.shiftsCanceled.push({ shift: item.shift });
              shiftsWalletUser.shiftsAbsents.splice(index, 1);
              await ShiftsWalletService.update(
                { _id: swUser_ID },
                shiftsWalletUser
              );
            }
          });

          //sw collector
          item.shift.state = "reconfirm-cancelled";
          shiftsWalletCollector.shiftsCanceled.push({ shift: item.shift });
          shiftsWalletAdminCollector.shiftsCanceled.push({ shift: item.shift });
          shiftsWalletCollector.shiftsAbsents.splice(index, 1);
          await ShiftsWalletService.update(
            { _id: sw_idCollector },
            shiftsWalletCollector
          );
          await ShiftsWalletService.update(
            //turno cancelado, se guarda en la wallet del admin collector
            { _id: swAC_id },
            shiftsWalletAdminCollector
          );
          return res.sendSuccess("Turno reconfirmado cancelado");
        }
      }
    });
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateReAsignCollector = async (req, res) => {
  try {
    const scid = req.params.scid;
    const emailNewCollector = req.body.newCollector;
    const cancelShift = req.body.cancel;
    const adminCollector = req.user.tokenInfo;
    const swAC_id = adminCollector.shiftsWallet.toString();
    const shiftsWalletAdminCollector = await ShiftsWalletService.getById(
      swAC_id
    );

    shiftsWalletAdminCollector.shiftsCanceled.forEach(async (item, index) => {
      if (item.shift._id.toString() === scid) {
        //data user
        const emailUser = item.shift.emailUser;
        const user = await UserService.getEmail({ email: emailUser });
        const swUser_id = user.shiftsWallet.toString();
        const shiftsWalletUser = await ShiftsWalletService.getById(swUser_id);

        if (emailNewCollector) {
          //data nuevo collector
          const newCollector = await CollectorService.getOne({
            email: emailNewCollector,
          });
          if (!newCollector)
            return res.sendRequestError("Recolector no encontrado");
          const swCollector_id = newCollector.shiftsWallet.toString();
          const shiftsWalletCollector = await ShiftsWalletService.getById(
            swCollector_id
          );
          //turno reasignado
          const shiftReAsign = {
            _id: item.shift._id.toString(),
            state: "re-asigned",
            collector: `${newCollector.first_name} ${newCollector.last_name}`,
            emailCollector: newCollector.email,
            collectionNumberCollector: newCollector.collectionNumber,
            date: item.shift.date,
            hour: item.shift.hour,
            street: item.shift.street,
            height: item.shift.height,
            emailUser: item.shift.emailUser,
            recyclingNumber: user.recyclingNumber,
            points: item.shift.points,
            activatedPoints: false,
          };

          //elimino en user, el turno confirmado por el collector anterior
          shiftsWalletUser.shiftsConfirmed.forEach((item, index) => {
            if (item.shift._id.toString() === scid) {
              shiftsWalletUser.shiftsConfirmed.splice(index, 1);
            }
          });
          //pusheo el turno reasignado con el nuevo collector
          shiftsWalletUser.shiftsConfirmed.push({ shift: shiftReAsign });
          shiftsWalletCollector.shiftsConfirmed.push({ shift: shiftReAsign });
          await ShiftsWalletService.update(
            { _id: swUser_id },
            shiftsWalletUser
          );
          await ShiftsWalletService.update(
            { _id: swCollector_id },
            shiftsWalletCollector
          );

          //shifts wallet admin collector
          //lo pusheo en confirmed, y lo elimino de confirmed
          shiftsWalletAdminCollector.shiftsConfirmed.push({
            shift: shiftReAsign,
          });
          shiftsWalletAdminCollector.shiftsCanceled.splice(index, 1);
          await ShiftsWalletService.update(
            { _id: swAC_id },
            shiftsWalletAdminCollector
          );

          return res.sendSuccess("Turno reasignado");
        }
        //si no hay recolectores, el admincollector cancela el turno al user
        if (cancelShift === "cancel") {
          shiftsWalletUser.shiftsConfirmed.forEach((item, index) => {
            if (item.shift._id.toString() === scid) {
              shiftsWalletUser.shiftsCanceled.push({
                shift: {
                  _id: item.shift._id.toString(),
                  emailCollector: item.shift.emailCollector,
                  date: item.shift.date,
                  hour: item.shift.hour,
                  street: item.shift.street,
                  height: item.shift.height,
                  emailUser: item.shift.emailUser,
                  points: item.shift.points,
                },
              });
              shiftsWalletUser.shiftsConfirmed.splice(index, 1);
            }
          });
          await ShiftsWalletService.update({_id: user.shiftsWallet.toString()}, shiftsWalletUser);

          return res.sendSuccess("Turno cancelado");
        };
      };
    });
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateDoneShift = async (req, res) => {
  try {
    const scid = req.params.scid;
    const done = req.body.done; //(true)
    const editKG = req.body.kg; //para editar points del user
    const collector = req.user.tokenInfo;
    const shiftsWalletID = collector.shiftsWallet.toString();

    //tengo que traer la billetera de turnos, y allí dentro buscar este turno y modificarlo
    const shiftsWallet = await ShiftsWalletService.getById(shiftsWalletID);

    if (!shiftsWallet) return res.sendRequestError("Petición incorrecta");

    await shiftsWallet.shiftsConfirmed.map(async (item) => {
      //si collector modifica kg por body
      if (
        item.shift._id == scid &&
        editKG && //hay kg en body para editar  points
        item.shift.emailCollector == collector.email //solo recolector que confirmó el turno, puede darle done: true
      ) {
        item.shift.done = done;
        item.shift.points = editKG;
      }
      if (
        item.shift._id == scid &&
        !editKG && //no hay kg para editar
        item.shift.emailCollector == collector.email
      ) {
        item.shift.done = done;
      }
      //se pasan los puntos a la pointsWallet del user, en notEnabledPoints
      //y luego en finalized se le habilitarán  a la propiedad enabledpoints
      const user = await UserService.getEmail({
        email: item.shift.emailUser,
      });
      const pointsWalletID = user.pointsWallet.toString();
      await PointsWalletService.update(pointsWalletID, {
        notEnabledPoints: item.shift.points,
      });

      //actualizo el numero de reciclaje del usuario
      await UserService.update(
        { _id: user._id.toString() },
        { recyclingNumber: user.recyclingNumber + 1 }
      );
    });

    //actualizo billetera turnos con los turnos done:true
    const result = await ShiftsWalletService.update(
      shiftsWalletID,
      shiftsWallet
    );
    //actualizo recolector, nro de recolecciones, añadiendole 1(recién finalizada)
    const collectorDB = await CollectorService.getById(
      collector._id.toString()
    ); //collector database
    // console.log(collectorDB);
    await CollectorService.update(
      { _id: collector._id.toString() },
      { collectionNumber: collectorDB.collectionNumber + 1 }
    );

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const finalizedProcess = async (req, res) => {
  //solo admincollector
  try {
    const cid = req.params.cid; //(cid= Collector ID)
    const collector = await CollectorService.getById(cid);

    if (!collector) res.sendRequestError("Petición incorrecta");

    const pointsWalletCollectorID = collector.pointsWallet.toString();
    const shiftswalletID = collector.shiftsWallet.toString();
    //traigo las dos wallets del collector
    let pointsWalletCollector = await PointsWalletService.getById(
      pointsWalletCollectorID
    );
    const shiftsWallet = await ShiftsWalletService.getById(shiftswalletID);

    let points = 0;

    await shiftsWallet.shiftsConfirmed.forEach(async (item, index) => {
      if (
        item.shift.done === true &&
        item.shift.activatedPoints === false //solo suma puntos cuando activatedPoints esta en false
      ) {
        points = points + item.shift.points;

        //actualizo shiftsWallet (collector) de confirmed pasan a FINALIZED
        item.shift.activatedPoints = "true"; //activan los puntos y queda inutilizado
        item.shift.state = "finalized";
        shiftsWallet.shiftsFinalized.push({ shift: item.shift });
        shiftsWallet.shiftsConfirmed.splice(index, 1);

        //actualizo wallet points del USER
        const user = await UserService.getEmail({
          email: item.shift.emailUser,
        });
        const pointsWalletUserID = user.pointsWallet.toString();
        const pointsWalletUser = await PointsWalletService.getById(
          pointsWalletUserID
        );

        await PointsWalletService.update(
          { _id: pointsWalletUserID },
          {
            enabledPoints:
              pointsWalletUser.enabledPoints +
              pointsWalletUser.notEnabledPoints,
            notEnabledPoints: 0,
          }
        );

        //actualizo la shiftsWallet del USER
        const shift = item.shift;
        const swUser_id = user.shiftsWallet.toString();
        const shiftsWalletUser = await ShiftsWalletService.getById(swUser_id);
        shift.state = "finalized";
        // console.log("shiftUser:", shift);
        shiftsWalletUser.shiftsFinalized.push({ shift: shift });
        shiftsWalletUser.shiftsConfirmed.length = 0; //ojo cuando tenga dos turnos del mismo usuario, ya q borrara todo, incluso si habria uno aun no realizado
        await ShiftsWalletService.update({ _id: swUser_id }, shiftsWalletUser);
      }
    });

    //cuando no hay turnos por finalizar
    if (points === 0)
      return res.status(206).json({
        message:
          "Todos sus puntos ya fueron habilitados, confirme nuevos turnos para seguir ganando puntos",
      });

    //actualizo billetera de turnos de collector
    await ShiftsWalletService.update({ _id: shiftswalletID }, shiftsWallet);

    //actualizo la billetera de puntos del collector OK
    await PointsWalletService.update(
      { _id: pointsWalletCollectorID },
      { enabledPoints: pointsWalletCollector.enabledPoints + points }
    );

    res.sendSuccess("Puntos habilitados");
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const cancelShift = async (req, res) => {
  try {
    const shiftCancelID = req.params.sid;
    const user = req.user.tokenInfo;
    const swUser_ID = user.shiftsWallet.toString();
    const shiftsWalletUser = await ShiftsWalletService.getById(swUser_ID);

    //si shift aun está pendiente, lo busca en shiftsNotConfirmed
    if (shiftsWalletUser.shiftsNotConfirmed.length > 0) {
      await shiftsWalletUser.shiftsNotConfirmed.forEach(async (item, index) => {
        if (item.shift._id.toString() === shiftCancelID) {
          const shift = await ShiftsService.getById(shiftCancelID);
          shiftsWalletUser.shiftsCanceled.push({
            shift: {
              _id: shift._id.toString(),
              emailCollector: shift.emailCollector,
              date: shift.date,
              hour: shift.hour,
              street: shift.street,
              height: shift.height,
              emailUser: shift.emailUser,
              points: shift.points,
            },
          });
          shiftsWalletUser.shiftsNotConfirmed.splice(index, 1);
          await ShiftsWalletService.update(
            { _id: swUser_ID },
            shiftsWalletUser
          );
          //elimino shit de coleccion publica shifts not confirmed
          await ShiftsService.delete(shiftCancelID);
          return res.sendSuccess("Turno cancelado");
        }
      });
    }

    //si el turno esta en confirmados, buscar el collector, cancelarselo en su billetera y colocarlo en
    //cancelados en la billetera del user
    await shiftsWalletUser.shiftsConfirmed.forEach(async (item, index) => {
      if (item.shift._id.toString() == shiftCancelID) {
        //editar shiftsWallet del collector
        const collectorEmail = item.shift.emailCollector;
        const collector = await CollectorService.getOne({
          email: collectorEmail,
        });
        const sw_id = collector.shiftsWallet.toString();
        const shiftsWalletCollector = await ShiftsWalletService.getById(sw_id);
        item.shift.state = "cancelled";
        shiftsWalletCollector.shiftsCanceled.push({ shift: item.shift });
        shiftsWalletCollector.shiftsConfirmed.forEach((item, index) => {
          if (item.shift._id.toString() == shiftCancelID) {
            shiftsWalletCollector.shiftsConfirmed.splice(index, 1);
          }
        });
        await ShiftsWalletService.update({ _id: sw_id }, shiftsWalletCollector);

        //edición shiftswallet del user
        shiftsWalletUser.shiftsCanceled.push({ shift: item.shift });
        shiftsWalletUser.shiftsConfirmed.splice(index, 1);
        await ShiftsWalletService.update({ _id: swUser_ID }, shiftsWalletUser);

        return res.sendSuccess(
          "Turno cancelado, ya hemos avisado a su recolector asignado"
        );
      }
    });
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const cancelCollectorShift = async (req, res) => {
  try {
    const scid = req.params.scid;
    const collector = req.user.tokenInfo;
    const sw_id = collector.shiftsWallet.toString();
    const shiftsWalletCollector = await ShiftsWalletService.getById(sw_id);
    if (!shiftsWalletCollector)
      return res.sendRequestError("Petición incorrecta");

    //data admincollector
    const emailAdminCollector = collector.adminCollector;
    const adminCollector = await CollectorService.getOne({
      email: emailAdminCollector,
    });
    const swAC_id = adminCollector.shiftsWallet.toString();
    const shiftsWalletAdminCollector = await ShiftsWalletService.getById(
      swAC_id
    );

    shiftsWalletCollector.shiftsConfirmed.forEach(async (item, index) => {
      if (item.shift._id.toString() === scid) {
        item.shift.state = "cancelled-by-collector";

        //cancelo el turno aca en la wallet del collector
        shiftsWalletCollector.shiftsCanceled.push({ shift: item.shift });
        //si el collector, cancela más de 5 turnos en una semana, su cuenta se inactiva
        shiftsWalletAdminCollector.shiftsCanceled.push({ shift: item.shift });
        shiftsWalletCollector.shiftsConfirmed.splice(index, 1);
        await ShiftsWalletService.update({ _id: sw_id }, shiftsWalletCollector);
        await ShiftsWalletService.update(
          //lo mando a la wallet del admincollector para que reasigne collector al shift
          { _id: swAC_id },
          shiftsWalletAdminCollector
        );
        if (shiftsWalletCollector.shiftsCanceled.length > 5) {
          await CollectorService.update(
            { _id: collector._id.toString() },
            { status: "inactive" }
          );
        }
        return res.sendSuccess(
          "Turno cancelado. Recuerda que no puedes cancelar más de 5 turnos por mes"
        );
      }
    });
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const cancelAdminCollectorShift = async (req, res) => {
  try {
    const cid = req.params.cid; //collector id
    const scid = req.params.scid;

    const collector = await CollectorService.getById(cid);
    const sw_id = collector.shiftsWallet.toString();
    const shiftsWalletCollector = await ShiftsWalletService.getById(sw_id);

    shiftsWalletCollector.shiftsConfirmed.forEach(async (item, index) => {
      //si el turno está confirmado y también realizado (done= true), modificar sus pointsWallet
      //cancelando los puntos que en done, se le sumaron en su pw en notenabled (solo en user, collector no)
      //ya que los puntos en collector solo se cargan en endpoint finalized
      if (item.shift._id.toString() === scid) {
        item.shift.state = "invalid";
        const user = await UserService.getEmail({
          email: item.shift.emailUser,
        });
        const swUser_id = user.shiftsWallet.toString();
        const shiftsWalletUser = await ShiftsWalletService.getById(swUser_id);

        //si el turno a invalidar, ya se realizó, modificar pw también
        if (item.shift.done === true) {
          //le resto los puntos que se le habían asignado
          //pw user
          const pwUser_id = user.pointsWallet.toString();
          const pointsWalletUser = await PointsWalletService.getById(pwUser_id);
          pointsWalletUser.notEnabledPoints =
            pointsWalletUser.notEnabledPoints - item.shift.points;
          await PointsWalletService.update(
            { _id: pwUser_id },
            pointsWalletUser
          );

          //modifico los recyclingNumber(user) y collectionNumber(collector) restandole 1
          user.recyclingNumber = user.recyclingNumber - 1;
          await UserService.update({ _id: user._id.toString() }, user);

          collector.collectionNumber = collector.collectionNumber - 1;
          await CollectorService.update(
            { _id: collector._id.toString() },
            collector
          );
        }

        //si turno aun no se realizó, modificar solo sw
        //sw user
        shiftsWalletUser.shiftsCanceled.push({ shift: item.shift });
        shiftsWalletUser.shiftsConfirmed.forEach(async (item, index) => {
          if (item.shift._id.toString() === scid) {
            shiftsWalletUser.shiftsConfirmed.splice(index, 1);
            await ShiftsWalletService.update(
              { _id: swUser_id },
              shiftsWalletUser
            );
          }
        });

        //sw collector
        shiftsWalletCollector.shiftsCanceled.push({ shift: item.shift });
        shiftsWalletCollector.shiftsConfirmed.splice(index, 1);
        await ShiftsWalletService.update({ _id: sw_id }, shiftsWalletCollector);

        return res.sendSuccess("Turno inválido");
      }
    });
  } catch (error) {
    res.sendServerError(error.message);
  }
};
