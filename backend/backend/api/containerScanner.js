/**
 *
 * Copyright HackerBay, Inc.
 *
 */
const express = require('express');
const router = express.Router();
const ContainerSecurityService = require('../services/containerSecurityService');
const ContainerSecurityLogService = require('../services//containerSecurityLogService');
const isAuthorizedContainerScanner = require('../middlewares/containerScannerAuthorization')
    .isAuthorizedContainerScanner;
const sendErrorResponse = require('../middlewares/response').sendErrorResponse;
const sendItemResponse = require('../middlewares/response').sendItemResponse;
const RealTimeService = require('../services/realTimeService');
const MailService = require('../services/mailService');
const UserService = require('../services/userService');
const ProjectService = require('../services/projectService');

router.get('/containerSecurities', isAuthorizedContainerScanner, async function(
    req,
    res
) {
    try {
        const response = await ContainerSecurityService.getSecuritiesToScan();
        return sendItemResponse(req, res, response);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});
router.post('/scanning', isAuthorizedContainerScanner, async function(
    req,
    res
) {
    try {
        const security = req.body.security;
        const containerSecurity = await ContainerSecurityService.updateOneBy(
            {
                _id: security._id,
            },
            { scanning: true }
        );

        RealTimeService.handleScanning({ security: containerSecurity });
        return sendItemResponse(req, res, containerSecurity);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

router.post('/failed', isAuthorizedContainerScanner, async function(req, res) {
    try {
        const security = req.body;
        const containerSecurity = await ContainerSecurityService.updateOneBy(
            {
                _id: security._id,
            },
            { scanning: false }
        );
        return sendItemResponse(req, res, containerSecurity);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});
router.post('/log', isAuthorizedContainerScanner, async function(req, res) {
    try {
        const security = req.body;
        const securityLog = await ContainerSecurityLogService.create({
            securityId: security.securityId,
            componentId: security.componentId,
            data: security.data,
        });

        const selectContainerLog =
            'securityId componentId data deleted deleteAt';

        const populateContainerLog = [
            { path: 'securityId', select: 'name slug' },
            { path: 'componentId', select: 'name slug projectId' },
        ];
        const findLog = await ContainerSecurityLogService.findOneBy({
            query: { _id: securityLog._id },
            select: selectContainerLog,
            populate: populateContainerLog,
        });
        const project = await ProjectService.findOneBy({
            query: { _id: findLog.componentId.projectId },
            select: '_id name users',
        });
        const userIds = project.users.map(e => ({ id: e.userId })); // This cater for projects with multiple registered members

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i].id;
            const user = await UserService.findOneBy({
                query: { _id: userId },
                select: '_id email name',
            });
            await MailService.sendContainerEmail(project, user);
        }
        RealTimeService.handleLog({
            securityId: security.securityId,
            securityLog: findLog,
        });

        return sendItemResponse(req, res, findLog);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

router.post('/time', isAuthorizedContainerScanner, async function(req, res) {
    try {
        const security = req.body;
        const updatedTime = await ContainerSecurityService.updateScanTime({
            _id: security._id,
        });
        return sendItemResponse(req, res, updatedTime);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

module.exports = router;
