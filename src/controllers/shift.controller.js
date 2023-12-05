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
    const data = req.body;

    const result = await ShiftsService.create({
      date: data.date,
      hour: data.hour,
      street: user.street,
      height: user.height,
      emailUser: user.email,
      recyclingNumber: user.recyclingNumber,
      points: data.points,
    });
    if (!result)
      return res.sendRequestError("Petición incorrecta, turno no agendado");

    //cuando creo el turno, los puntos se guardan en notenabledPoints dentro de su billetera
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateShiftConfirmed = async (req, res) => {
  //solo recolectores

  try {
    const sid = req.params.sid;
    // const collector = req.body.collector;
    const collector= req.user.tokenInfo;
    const sw_id= req.user.tokenInfo.shiftsWallet.toString();   

    const shiftNotConfirmed = await ShiftsService.getById(sid); //turno del usuario
    const shiftsWallet= await ShiftsWalletService.getById(sw_id);
    // const shiftsWallet = await ShiftsWalletService.getById(
    //   "656916dae5ed20dafdb5e721"
    // ); //para meter turno confirmado

    if (!shiftNotConfirmed) return res.sendRequestError("Petición incorrecta");

    //número total de viajes reciclados del recolector
    const numberRecollection = shiftsWallet.shifts.length + 1;

    const shiftConfirmed = {
      _id: shiftNotConfirmed._id.toString(), //solo guardo _id string
      state: "confirmed",
      collector: `${collector.first_name} ${collector.last_name}`,
      recollectionNumberCollector: numberRecollection,
      date: shiftNotConfirmed.date,
      hour: shiftNotConfirmed.hour,
      street: shiftNotConfirmed.street,
      height: shiftNotConfirmed.height,
      emailUser: shiftNotConfirmed.emailUser,
      recyclingNumber: 20,
      points: shiftNotConfirmed.points,
      activatedPoints: shiftNotConfirmed.activatedPoints,
    };

    shiftsWallet.shifts.push({ shiftConfirmed: shiftConfirmed });

    const result = await ShiftsWalletService.update(
      { _id: sw_id },
      shiftsWallet
    );

    //al confirmar el turno, los puntos del reciclado se colocan en la pointsWallet del user, en notEnabledPoints
    //y luego en finalized se le habilitarán  a la propiedad enabledpoints
    const user = await UserService.getEmail({
      email: shiftNotConfirmed.emailUser,
    });
    const pointsWalletID = user.pointsWallet.toString();
    await PointsWalletService.update(pointsWalletID, {
      notEnabledPoints: shiftNotConfirmed.points,
    });

    //elimino el turno de la base de datos de turnos no confirmados
    await ShiftsService.delete(sid);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateDoneShift = async (req, res) => {
  //solo recolector que tomó ese turno puede darle true
  try {
    const scid = req.params.scid;
    const done = req.body.done; //(true)
    //tengo que traer la billetera de turnos, y allí dentro buscar este turno y modificarlo
    const shiftsWallet = await ShiftsWalletService.getById(
      "656916dae5ed20dafdb5e721"
    ); //esto tomarlo de token

    if (!shiftsWallet) return res.sendRequestError("Petición incorrecta");
    await shiftsWallet.shifts.map((item) => {
      if (item.shiftConfirmed._id == scid) {
        item.shiftConfirmed.done = done;
      }
    });
    const result = await ShiftsWalletService.update(
      "656916dae5ed20dafdb5e721",
      shiftsWallet
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
    const pointsWalletCollectorID = collector.pointsWallet.toString();
    const shiftswalletID = collector.shiftsWallet.toString();
    // console.log(collector, pointWalletID,shiftswalletID)

    let pointsWalletCollector = await PointsWalletService.getById(
      pointsWalletCollectorID
    );
    const shiftsWallet = await ShiftsWalletService.getById(shiftswalletID);
    // console.log(shiftsWallet.shifts);

    let points = 0;

    shiftsWallet.shifts.map(async (item) => {
      if (
        item.shiftConfirmed.done === true && //solo suma puntos cuando activatedPoints esta en false
        item.shiftConfirmed.activatedPoints === false
      ) {
        item.shiftConfirmed.activatedPoints = "true"; //activan los puntos y queda inutilizado
        points = points + item.shiftConfirmed.points;

        //actualizo la billetera de puntos del usuario, habilitándole los puntos no habilitados
        const user = await UserService.getEmail({
          email: item.shiftConfirmed.emailUser,
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
