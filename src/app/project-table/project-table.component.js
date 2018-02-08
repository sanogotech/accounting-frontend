(function() {
	'use strict';

	// Register the 'project' page along with its controller an template
	angular.module('projectTable').component('projectTable', {
		templateUrl: 'app/project-table/project-table.template.html',
		controller: ProjectTableController,
		controllerAs: 'vm'
	});

	ProjectTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

	function ProjectTableController($mdDialog, Auth, OtherResource) {
		var vm = this;
		//get the items of the table
		vm.projects = OtherResource.api('project').query();
		vm.user = Auth.user;
		//variables
		vm.project = {};
		vm.title = '';
		//functions
		vm.editItem = editItem;
		vm.addItem = addItem;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(project) {
			vm.project = project;
			vm.title = 'Edit Project';
			showFormDialog();
		}

		function addItem() {
			vm.project = {};
			vm.title = 'Add Project';
			showFormDialog();
		}

		//Dialogs________________________________________________________________
		function showFormDialog(ev) {
			$mdDialog.show({
				controller: FormDialogController,
				controllerAs: 'vm',
				templateUrl: 'app/project-table/form-dialog.template.html',
				targetEvent: ev,
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				locals: { title: vm.title, itemId: vm.project.id }
			});
		}
		function FormDialogController(
			$mdDialog,
			$mdToast,
			AutocompleteFields,
			OtherResource,
			title,
			itemId
		) {
			var vm2 = this;
			//functions callable from the html
			vm2.cancel = cancel;
			vm2.editProject = editProject;
			vm2.showConfirmDialog = showConfirmDialog;
			vm2.autocompleteSearch = autocompleteSearch;
			//get the data from the service
			vm.project.id
				? OtherResource.api('project')
						.get({ id: vm.project.id })
						.$promise.then(function(res) {
							vm2.project = res;
						})
				: (vm2.project = { description: '' });
			vm2.clientList = OtherResource.api('client').query();
			vm2.employeeList = OtherResource.api('employee').query();
			vm2.typeList = OtherResource.api('project-type').query();

			vm2.title = title;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editProject() {
				return OtherResource.save('project', vm2.project).then(
					function(value) {
						OtherResource.api('project')
							.query()
							.$promise.then(function(res) {
								vm.projects = res;
								$mdDialog.hide();
							});
						showToast('Succesfully Saved!');
						console.log('Project saved: ID=', value.id);
					},
					function(err) {
						$mdDialog.hide();
						showToast('An error occured');
						console.error(
							'The project cannot be modified',
							err.status,
							err.statusText
						);
					}
				);
			}

			function removeItem(project) {
				OtherResource.remove('project', project).then(
					function() {
						OtherResource.api('project')
							.query()
							.$promise.then(function(res) {
								vm.projects = res;
							});
						showToast('Project Deleted!');
						console.log('Succesfully removed');
					},
					function(err) {
						if (err.status == 409) showErrorDialog();
						console.error(
							'The item could not be deleted:',
							err.status,
							err.statusText
						);
					}
				);
				$mdDialog.hide();
			}

			//Related to the autocomplete form inputs
			function autocompleteSearch(query, items) {
				return AutocompleteFields.search(query, items);
			}

			//create a dialog and a toast to perform some actions________________________
			function showToast(msg) {
				$mdToast.show(
					$mdToast
						.simple()
						.textContent(msg)
						.position('top right')
						.hideDelay(2500)
				);
			}

			function showConfirmDialog(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the project?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem(vm2.project).then(console.log('Project Deleted!'));
					},
					function() {
						console.log('Delete project cancelled');
					}
				);
			}

			function showErrorDialog(ev) {
				$mdDialog.show(
					$mdDialog
						.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Error deleting the project')
						.textContent(
							'The project you are trying to delete has associated purchases. Please delete these purchases first'
						)
						.ariaLabel('Error Deleting Item')
						.ok('Ok')
						.targetEvent(ev)
				);
			}
		}
	}
})();
